import { connect, type ConnectParams, type Node } from "/lib/xp/node";
import type { CVPartnerEmployee } from "/lib/cvpartner/client";
import { forceArray } from "/lib/cvpartner/utils";
import { CVPartnerEmployeeProfile } from "/lib/cvpartner/client";

const REPO_NAME_CVPARTNER = "no.item.cvpartner.employees";

export const SOURCE_CVPARTNER_EMPLOYEES: ConnectParams = {
  repoId: REPO_NAME_CVPARTNER,
  branch: "master",
  principals: ["role:system.admin"],
};

export function getCVPartnerEmployeeByEmail(email: string): Node<CVPartnerEmployeeNode> | undefined {
  const connection = connect(SOURCE_CVPARTNER_EMPLOYEES);

  const hit = connection.query({
    count: 1,
    filters: {
      hasValue: {
        field: "data.cvPartnerEmployee.email",
        values: [email],
      },
    },
  }).hits[0];

  return hit?.id ? connection.get<CVPartnerEmployeeNode>(hit.id) ?? undefined : undefined;
}

export function getCVPartnerEmployeesByIds(ids: Array<string>): Array<Node<CVPartnerEmployeeNode>> {
  const connection = connect(SOURCE_CVPARTNER_EMPLOYEES);

  const res = connection
    .query({
      count: ids.length,
      filters: {
        boolean: {
          must: {
            ids: {
              values: ids,
            },
          },
        },
      },
    })
    .hits.map((hit) => hit.id);

  return forceArray(connection.get<CVPartnerEmployeeNode>(res));
}

export interface CVPartnerEmployeeNode {
  type: "no.item.cvpartner:employee",
  data: {
    cvPartnerEmployee: CVPartnerEmployee;
    cvPartnerEmployeeProfile?: CVPartnerEmployeeProfile;
  };
}

export interface CVPartnerImageEventData {
  imageUrl: string;
  id: string;
}
