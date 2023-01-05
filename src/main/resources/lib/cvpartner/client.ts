import { request } from "/lib/http-client";

export function fetchEmployees(): Array<CVPartnerEmployee> {
  const res = request({
    url: getEmployeeUrl(),
    contentType: "application/json",
    method: "GET",
    headers: {
      Authorization: `Bearer ${getEmployeeApiKey()}`,
    },
    params: {
      offset: "0",
    },
  });

  if (res.status === 200 && res.body) {
    return JSON.parse(res.body) as Array<CVPartnerEmployee>;
  } else {
    throw "Could not get employees from CV-Partner";
  }
}

function getEmployeeApiKey(): string {
  const cvPartnerApiKey = app.config.cvPartnerApiKey;
  if (cvPartnerApiKey === undefined) {
    throw "Could not find CV-Partner API key";
  }

  return cvPartnerApiKey;
}

function getEmployeeUrl(): string {
  const cvPartnerEmployeeUrl = app.config.cvPartnerEmployeeUrl;
  if (cvPartnerEmployeeUrl === undefined) {
    throw "Could not find CV-Partner employee URL";
  }

  return cvPartnerEmployeeUrl;
}

export interface CVPartnerEmployee {
  user_id: string;
  _id: string;
  id: string;
  company_id: string;
  company_name: string;
  company_subdomains?: Array<string> | null;
  company_group_ids?: Array<string> | null;
  email: string;
  external_unique_id?: string;
  upn?: string;
  deactivated: boolean;
  deactivated_at: string | boolean;
  created_at: string;
  updated_at: string;
  role: string;
  roles?: Array<string> | null;
  role_allowed_office_ids?: Array<string> | null;
  role_allowed_tag_ids?: Array<string> | null;
  office_id: string;
  office_name: string;
  country_id: string;
  country_code: string;
  language_code: string;
  language_codes?: Array<string> | null;
  international_toggle: string;
  preferred_download_format: string;
  masterdata_languages?: Array<string> | null;
  expand_proposals_toggle: boolean;
  selected_office_ids?: Array<string> | null;
  include_officeless_reference_projects: boolean;
  selected_tag_ids?: Array<string> | null;
  override_language_code?: string;
  default_cv_template_id?: string;
  image: {
    url?: string;
    thumb?: {
      url?: string;
    };
    fit_thumb?: {
      url?: string;
    };
    large?: {
      url?: string;
    };
    small_thumb?: {
      url?: string;
    };
  };
  name: string;
  telephone: string;
  default_cv_id: string;
}
