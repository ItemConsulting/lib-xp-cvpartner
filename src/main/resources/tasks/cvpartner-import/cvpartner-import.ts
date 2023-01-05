import { CVPartnerEmployee, fetchEmployees } from "/lib/cvpartner/client";
import { create as createRepo, get as getRepo } from "/lib/xp/repo";
import { connect } from "/lib/xp/node";
import { send } from "/lib/xp/event";
import { progress } from "/lib/xp/task";
import { sanitize } from "/lib/xp/common";

import {
  CVPartnerEmployeeNode,
  getCVPartnerEmployeeByEmail,
  SOURCE_CVPARTNER_EMPLOYEES,
} from "/lib/cvpartner/cvpartner-employee-repo";

type UpdateResult = [changed: number, unchanged: number];

const INITIAL_UPDATE_RESULT: UpdateResult = [0, 0];

export function run(): void {
  //Check if repo exists; create
  if (getRepo(SOURCE_CVPARTNER_EMPLOYEES.repoId) === null) {
    createRepo({
      id: SOURCE_CVPARTNER_EMPLOYEES.repoId,
    });
  }

  const connection = connect({
    ...SOURCE_CVPARTNER_EMPLOYEES,
  });

  const cvPartnerEmployees = fetchEmployees().filter((employee) => employee.email !== "" && employee.email !== null);

  const [changed, unchanged] = cvPartnerEmployees.reduce((updateResult, employee, index) => {
    const currentEmployee = getCVPartnerEmployeeByEmail(employee.email);

    const contentHasChanged = currentEmployee
      ? prepareForComparison(currentEmployee.data) !== prepareForComparison(employee)
      : true;

    try {
      if (!currentEmployee) {
        const data = connection.create<CVPartnerEmployeeNode>({
          _name: sanitize(employee.email),
          _inheritsPermissions: true,
          data: employee,
        });

        send({
          type: "cvpartner.create",
          data,
        });
      } else if (contentHasChanged) {
        const data = connection.modify<CVPartnerEmployeeNode>({
          key: currentEmployee._id,
          editor: (node) => {
            node.data = employee;
            return node;
          },
        });

        send({
          type: "cvpartner.modify",
          data,
        });
      }

      progress({
        current: index,
        total: cvPartnerEmployees.length,
        info: `Updated ${index} of ${cvPartnerEmployees.length} entries in "${SOURCE_CVPARTNER_EMPLOYEES.repoId}"`,
      });
    } catch (e) {
      log.error(String(e));
    }

    return updateCounter(updateResult, contentHasChanged);
  }, INITIAL_UPDATE_RESULT);

  connection.refresh("ALL");

  log.info(`Updated repo "${SOURCE_CVPARTNER_EMPLOYEES.repoId}" with ${changed} changes and ${unchanged} unchanged`);
}

function updateCounter([changed, unchanged]: UpdateResult, contentHasChanged: boolean): UpdateResult {
  return contentHasChanged ? [changed + 1, unchanged] : [changed, unchanged + 1];
}

function prepareForComparison(o: CVPartnerEmployee): string {
  //eliminate all the null, empty strings and empty array values from the data
  const obj = JSON.parse(JSON.stringify(o), (key, value) =>
    value === null || value === "" || (value instanceof Array && !value.length) ? undefined : value
  );

  //Handle arrays with one object as object per XP requirements
  return JSON.stringify(obj).replace(/]|[[]/g, "");
}
