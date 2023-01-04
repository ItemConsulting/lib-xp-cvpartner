import { connect, type ConnectParams, type Node } from "/lib/xp/node";
import type { CVPartnerEmployee } from "/lib/cvpartner/cvpartner-client";

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
        field: "data.email",
        values: [email],
      },
    },
  }).hits[0];

  return hit?.id ? connection.get<CVPartnerEmployeeNode>(hit.id) ?? undefined : undefined;
}

export function getCVPartnerEmployeeById(id: string): Node<CVPartnerEmployeeNode> | null {
  const connection = connect(SOURCE_CVPARTNER_EMPLOYEES);

  return connection.get<CVPartnerEmployeeNode>(id);
}

export interface CVPartnerEmployeeNode {
  data: CVPartnerEmployee;
}
