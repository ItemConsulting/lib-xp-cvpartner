import { CVPartnerEmployeeProfile, fetchEmployeeProfile, fetchEmployees } from "/lib/cvpartner/client";
import { create as createRepo, get as getRepo } from "/lib/xp/repo";
import { connect } from "/lib/xp/node";
import { send } from "/lib/xp/event";
import { progress } from "/lib/xp/task";
import { sanitize } from "/lib/xp/common";

import { CVPartnerEmployeeNode, getCVPartnerEmployeeByEmail, SOURCE_CVPARTNER_EMPLOYEES } from "/lib/cvpartner";
import { notNullOrUndefined } from "/lib/cvpartner/utils";

type UpdateResult = [changed: number, unchanged: number];

const INITIAL_UPDATE_RESULT: UpdateResult = [0, 0];

export function run(): void {
  const startTime = new Date().getTime();
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
    const cvPartnerProfile = fetchEmployeeProfile(employee.id, employee.default_cv_id);

    //image save to employee content
    const imageUrl = employee.image?.url;
    const currentEmployee = getCVPartnerEmployeeByEmail(employee.email);

    const employeeContentHasChanged = currentEmployee
      ? currentEmployee.data.cvPartnerEmployee.updated_at !== employee.updated_at
      : true;

    const currentEmployeeProfile = currentEmployee?.data.cvPartnerEmployeeProfile;

    const employeeProfileHasChanged =
      cvPartnerProfile && currentEmployeeProfile
        ? currentEmployeeProfile.updated_at !== cvPartnerProfile.updated_at
        : true;

    const contentHasChanged = employeeContentHasChanged || employeeProfileHasChanged;

    try {
      if (!currentEmployee) {
        const data = connection.create<CVPartnerEmployeeNode>({
          _name: sanitize(employee.email),
          _inheritsPermissions: true,
          type: "no.item.cvpartner:employee",
          data: { cvPartnerEmployee: employee, cvPartnerEmployeeProfile: cvPartnerProfile },
        });

        send({
          type: "cvpartner.create",
          data,
        });

        if (imageUrl) {
          send({
            type: "cvpartner.image",
            data: {
              imageUrl,
              id: employee.id,
            },
          });
        }
      } else if (contentHasChanged) {
        const data = connection.modify<CVPartnerEmployeeNode>({
          key: currentEmployee._id,
          editor: (node) => {
            node.data = { cvPartnerEmployee: employee, cvPartnerEmployeeProfile: cvPartnerProfile };
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

  const endTime = new Date().getTime();

  log.info(
    `Updated repo "${SOURCE_CVPARTNER_EMPLOYEES.repoId}" with ${changed} changes and ${unchanged} unchanged in ${
      (endTime - startTime) / 1000
    } seconds`
  );
}

function updateCounter([changed, unchanged]: UpdateResult, contentHasChanged: boolean): UpdateResult {
  return contentHasChanged ? [changed + 1, unchanged] : [changed, unchanged + 1];
}

export function getBiography(cvPartnerProfile: CVPartnerEmployeeProfile): string | undefined {
  return notNullOrUndefined(cvPartnerProfile.key_qualifications)
    ? cvPartnerProfile?.key_qualifications[0].long_description?.no
    : undefined;
}
