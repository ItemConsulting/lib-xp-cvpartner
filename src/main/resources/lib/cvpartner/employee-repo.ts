import { connect, type ConnectParams, type Node } from "/lib/xp/node";
import type { CVPartnerEmployee } from "/lib/cvpartner/client";
import { forceArray, notNullOrUndefined } from "/lib/cvpartner/utils";

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

export function getCVPartnerEmployees(searchParams?: string): Array<Node<CVPartnerEmployeeNode>> {
  const conn = connect(SOURCE_CVPARTNER_EMPLOYEES);

  const ids = conn
    .query({
      count: 1000,
      query: searchParams ? `data.name LIKE '*${searchParams}*' OR data.email LIKE '${searchParams}*'` : "",
      filters: {
        boolean: {
          mustNot: {
            ids: {
              values: ["000-000-000-000"],
            },
          },
        },
      },
    })
    .hits.map((hit) => hit.id);

  return forceArray(conn.get<CVPartnerEmployeeNode>(ids)).filter(notNullOrUndefined);
}

export function getCVPartnerEmployeeById(id: string): Node<CVPartnerEmployeeNode> | null {
  const connection = connect(SOURCE_CVPARTNER_EMPLOYEES);

  return connection.get<CVPartnerEmployeeNode>(id);
}

export interface CVPartnerEmployeeNode {
  data: CVPartnerEmployee;
}
