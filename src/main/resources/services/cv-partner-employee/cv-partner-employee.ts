import { getCVPartnerEmployees } from "/lib/cvpartner/employee-repo";
import { CustomSelectorServiceRequest, CustomSelectorServiceResponse } from "@item-enonic-types/global/controller";

export function get(req: CustomSelectorServiceRequest): CustomSelectorServiceResponse {
  try {
    const cvPartnerEmployees = getCVPartnerEmployees(req.params.query);

    return {
      status: 200,
      body: {
        count: cvPartnerEmployees.length,
        total: cvPartnerEmployees.length,
        hits: cvPartnerEmployees.map((employee) => {
          return {
            id: employee._id,
            displayName: employee.data.name + ` (${employee.data.email})`,
            description: employee.data.role,
            iconUrl: employee.data.image.url ? undefined : "",
          };
        }),
      },
    };
  } catch (e) {
    log.error(String(e));
  }

  return {
    status: 404,
    body: {
      count: 0,
      total: 0,
      hits: [],
    },
  };
}
