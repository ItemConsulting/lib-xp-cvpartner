import { request } from "/lib/http-client";

const CVPARTNER_USERS_PATH = "/api/v1/users";
const CVPARTNER_PROFILE_PATH = "/api/v3/cvs/";
export function fetchEmployees(): Array<CVPartnerEmployee> {
  const res = request({
    url: `${getCVPartnerBaseUrl()}${CVPARTNER_USERS_PATH}`,
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

export function fetchEmployeeProfile(userId: string, cvId: string): CVPartnerEmployeeProfile | undefined {
  const res = request({
    url: `${getCVPartnerBaseUrl()}${CVPARTNER_PROFILE_PATH}/${userId}/${cvId}`,
    contentType: "application/json",
    method: "GET",
    headers: {
      Authorization: `Bearer ${getEmployeeApiKey()}`,
    },
  });

  if (res.status === 200 && res.body) {
    return JSON.parse(res.body) as CVPartnerEmployeeProfile;
  } else {
    log.warning("Could not get CVPartner Employee profile for userId: " + userId + " with cvId: " + cvId);
    return undefined;
  }
}

function getEmployeeApiKey(): string {
  const cvPartnerApiKey = app.config.cvPartnerApiKey;
  if (cvPartnerApiKey === undefined) {
    throw "Could not find CV-Partner API key";
  }
  return cvPartnerApiKey;
}

function getCVPartnerBaseUrl(): string {
  const cvPartnerBaseUrl = app.config.cvPartnerBaseUrl;
  if (cvPartnerBaseUrl === undefined) {
    throw "Could not find CV-Partner base URL";
  }
  return cvPartnerBaseUrl;
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

export interface CVPartnerEmployeeProfile {
  _id: string;
  blogs: Blog[];
  born_day: number;
  born_month: number;
  born_year: number;
  bruker_id: string;
  created_at: Date;
  custom_tag_ids: string[];
  default: boolean;
  imported_date: null;
  key_qualifications: KeyQualification[];
  landline: null;
  level: null;
  modifier_id: null;
  name_multilang: Values;
  nationality: Values;
  navn: string;
  order: null;
  owner_updated_at: Date;
  owner_updated_at_significant: null;
  place_of_residence: Values;
  technologies: KeyQualification[];
  telefon: null;
  tilbud_id: null;
  title: Values;
  twitter: null;
  updated_at: Date;
  version: number;
  name: string;
  user_id: string;
  company_id: string;
  external_unique_id: null;
  email: string;
  country_code: string;
  language_code: string;
  language_codes: string[];
  proposal: null;
  custom_tags: CustomTag[];
  updated_ago: string;
  template_document_type: string;
  default_word_template_id: null;
  default_ppt_template_id: null;
  project_experiences: any[];
  certifications: any[];
  courses: any[];
  educations: any[];
  cv_roles: any[];
  highlighted_roles: any[];
  image: Image;
  can_write: boolean;
}

export interface Blog {
  _id: string;
  created_at: Date;
  disabled: boolean;
  diverged_from_master: boolean;
  external_unique_id: string;
  long_description: LongDescription;
  modifier_id: null;
  month: null;
  name: LongDescription;
  order: number;
  origin_id: null;
  owner_updated_at: Date | null;
  recently_added: boolean;
  starred: boolean;
  updated_at: Date;
  url: null;
  version: number;
  year: null;
}

export interface LongDescription {
  no: string;
  int?: string;
}

export interface CustomTag {
  _id: string;
  id: string;
  values: Values;
  external_unique_id: string;
  custom_tag_category_id: string;
  category_ids: string[];
  custom_tag_category: CustomTagCategory;
}

export interface CustomTagCategory {
  _id: string;
  id: string;
  values: Values;
  external_unique_id: string;
  can_be_used_for_cvs: boolean;
  can_be_used_for_references: boolean;
  can_be_used_for_customers: boolean;
  allow_filtering: boolean;
}

export interface Values {
  no: string;
  en: string;
}

export interface Image {
  url: string;
  thumb: FitThumb;
  fit_thumb: FitThumb;
  large: FitThumb;
  small_thumb: FitThumb;
}

export interface FitThumb {
  url: string;
}

export interface KeyQualification {
  _id: string;
  created_at: Date;
  disabled: boolean;
  diverged_from_master: boolean;
  external_unique_id: null;
  label?: Values;
  long_description?: Values;
  modifier_id: null;
  order: number | null;
  origin_id: null;
  owner_updated_at: Date | null;
  recently_added: boolean;
  starred: boolean;
  tag_line?: Values;
  updated_at: Date;
  version: number;
  category?: Values;
  exclude_tags?: any[];
  uncategorized?: boolean;
}
