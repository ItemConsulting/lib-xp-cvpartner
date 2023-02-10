import {
  CVPartnerEmployeeNode,
  getCVPartnerEmployeesByIds,
  SOURCE_CVPARTNER_EMPLOYEES,
} from "/lib/cvpartner/employee-repo";
import { CustomSelectorServiceRequest, CustomSelectorServiceResponse } from "@item-enonic-types/global/controller";
import { forceArray } from "/lib/cvpartner/utils";
import { connect } from "/lib/xp/node";

export function get(req: CustomSelectorServiceRequest): CustomSelectorServiceResponse {
  if (req.params.ids) {
    const cvPartnerEmployees = getCVPartnerEmployeesByIds(req.params.ids.split(","));

    return {
      status: 200,
      body: {
        count: cvPartnerEmployees.length,
        total: cvPartnerEmployees.length,
        hits: cvPartnerEmployees.map((employee) => {
          return {
            id: employee.data.cvPartnerEmployee.id,
            displayName: employee.data.cvPartnerEmployee.name + ` (${employee.data.cvPartnerEmployee.email})`,
            description: employee.data.cvPartnerEmployee.role ?? "",
            iconUrl: employee.data.cvPartnerEmployee.image?.url ?? "",
          };
        }),
      },
    };
  }

  const start = parseInt(req.params.start ?? "0");
  const count = parseInt(req.params.count ?? "10");

  const searchParams = req.params.query;
  const connection = connect(SOURCE_CVPARTNER_EMPLOYEES);

  const result = connection.query({
    start,
    count,
    query: searchParams
      ? `data.cvPartnerEmployee.name LIKE '*${searchParams}*' OR data.cvPartnerEmployee.email LIKE '${searchParams}*'`
      : "",
    sort: {
      field: "data.cvPartnerEmployee.name",
      direction: "ASC",
    },
    filters: {
      boolean: {
        mustNot: {
          ids: {
            values: ["000-000-000-000"],
          },
        },
      },
    },
  });

  const hits = forceArray(connection.get<CVPartnerEmployeeNode>(result.hits.map((hit) => hit.id)));

  return {
    status: 200,
    body: {
      count: result.count,
      total: result.total,
      hits: hits.map((employee) => {
        return {
          id: employee.data.cvPartnerEmployee.id,
          displayName: employee.data.cvPartnerEmployee.name + ` (${employee.data.cvPartnerEmployee.email})`,
          description: employee.data.cvPartnerEmployee.role ?? "",
          iconUrl: employee.data.cvPartnerEmployee.image?.url ?? "",
        };
      }),
    },
  };
}
