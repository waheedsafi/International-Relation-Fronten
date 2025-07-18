export const SectionEnum = {
  users: "users",
  dashboard: "dashboard",
  reports: "reports",
  settings: "settings",
  logs: "logs",
  audit: "audit",
  projects: "projects",
  about: "management/about",
  news: "management/news",
  ngo: "ngo",
  donor: "donor",
  aproval: "aproval",
};
export const LanguageEnum = {
  english: "english",
  farsi: "farsi",
  pashto: "pashto",
};
export const RoleEnum = {
  super: 1,
  admin: 2,
  user: 3,
  debugger: 4,
  ngo: 5,
  donor: 6,
};
export const TaskTypeEnum = {
  ngo_registeration: 1,
  project_registeration: 2,
  ngo_agreement_extend: 3,
  project_extend: 4,
  scheduling: 5,
};
export const ChecklistEnum = {
  director_nid: 1,
  // NgoDirectorProfile: 2,
  director_work_permit: 3,
  ngo_representor_letter: 4,
  ministry_of_economy_work_permit: 5,
  articles_of_association: 6,
  ngo_register_form_en: 8,
  ngo_register_form_ps: 9,
  ngo_register_form_fa: 10,

  // project checklist
  moe_project_introduction_letter: 11, // Project introduction letter from Ministry of Economy
  project_articles_of_association: 12,
  project_presentation: 13, // Project Presentation
  ngo_and_donor_contract: 14, // NGO & Donor Contract Letter
  mou_en: 15, // Memorandum of Understanding (English)
  mou_fa: 16, // Memorandum of Understanding (Farsi)
  mou_ps: 17,
  project_ministry_of_economy_work_permit: 18,

  // Schedule
  schedule_deputy_document: 19,
};

export const ApprovalTypeEnum = {
  pending: 1,
  approved: 2,
  rejected: 3,
};
export const PermissionEnum = {
  users: {
    name: "users",
    sub: {
      user_information: 1,
      user_password: 2,
      user_permission: 3,
    },
  },
  dashboard: { name: "dashboard", sub: {} },
  reports: { name: "reports", sub: {} },
  configurations: {
    name: "configurations",
    sub: {
      configurations_job: 21,
      configurations_checklist: 22,
      configurations_news_type: 23,
      configurations_priority: 24,
    },
  },
  logs: { name: "logs", sub: {} },
  audit: { name: "audit", sub: {} },
  projects: {
    name: "projects",
    sub: {
      detail: 61,
      center_budget: 62,
      organ_structure: 63,
      checklist: 64,
    },
  },
  about: {
    name: "management/about",
    sub: {
      director: 71,
      manager: 72,
      office: 73,
      pic: 74,
      technical: 75,
    },
  },
  news: {
    name: "management/news",
    sub: {},
  },
  ngo: {
    name: "ngo",
    sub: {
      ngo_information: 52,
      ngo_director_information: 53,
      ngo_agreement: 54,
      ngo_agreement_status: 55,
      ngo_more_information: 56,
      ngo_status: 57,
      ngo_representative: 58,
      ngo_update_account_password: 59,
    },
  },
  donor: {
    name: "donor",
    sub: {
      donor_information: 101,
      donor_status: 102,
    },
  },
  approval: {
    name: "approval",
    sub: {
      user: 31,
      ngo: 32,
      donor: 33,
    },
  },
  activity: {
    name: "activity",
    sub: {
      user: 41,
      password: 42,
    },
  },
};
export const StatusEnum = {
  active: 1,
  blocked: 2,
  document_upload_required: 3,
  pending_approval: 4,
  rejected: 5,
  expired: 6,
  extended: 7,
  approved: 8,
  registered: 9,

  // NGO
  registration_incomplete: 10,

  // Project
  pending_for_schedule: 11,
  has_comment: 12,
  scheduled: 13,
};

export const StaffEnum = {
  manager: 1,
  director: 2,
  technical_support: 3,
};
export const CountryEnum = {
  afghanistan: 2,
};
export const PriorityEnum = {
  high: 1,
  medium: 2,
  low: 3,
};

export const PERMISSIONS_OPERATION = ["Add", "Edit", "Delete", "View"];

export const DestinationTypeEnum = {
  muqam: "1",
  directorate: "2",
};
export const afgMonthNamesFa = [
  "حمل",
  "ثور",
  "جوزا",
  "سرطان",
  "اسد",
  "سنبله",
  "میزان",
  "عقرب",
  "قوس",
  "جدی",
  "دلو",
  "حوت",
];
export const afgMonthNamesEn = [
  "Hamal",
  "Sawr",
  "Jawza",
  "Saratan",
  "Asad",
  "Sonbola",
  "Mezan",
  "Aqrab",
  "Qaws ",
  "Jadi ",
  "Dalwa",
  "Hoot",
];
// Indexedb keys
export const CALENDAR = {
  Gregorian: "1",
  SOLAR: "2",
  LUNAR: "3",
};
export const CALENDAR_LOCALE = {
  english: "1",
  farsi: "2",
  arabic: "3",
};
export const CALENDAR_FORMAT = {
  format_1: "YYYY-MM-DD hh:mm A",
  format_2: "YYYY-MM-DD",
  format_3: "YYYY/MM/dddd",
  format_4: "dddd DD MMMM YYYY / hh:mm:ss A",
};
export const CACHE = {
  USER_TABLE_PAGINATION_COUNT: "USER_TABLE",
  PROJECT_TABLE_PAGINATION_COUNT: "PROJECT_TABLE",
  AUDIT_TABLE_PAGINATION_COUNT: "AUDIT_TABLE",
  NGO_TABLE_PAGINATION_COUNT: "NGO_TABLE",
  DONOR_TABLE_PAGINATION_COUNT: "DONOR_TABLE",
  NGO_LIST_TABLE_PAGINATION_COUNT: "NGO_LIST_TABLE",
  NEWS_TABLE_PAGINATION_COUNT: "NEWS_TABLE",
  NEWS_PUB_TABLE_PAGINATION_COUNT: "NEWS_PUB_TABLE",
  APPROVAL_TABLE_PAGINATION_COUNT: "APPROVAL_TABLE",
  USER_ACTIVITY_TABLE_PAGINATION_COUNT: "USER_ACTIVITY_TABLE",
  SYSTEM_CALENDAR: "SYSTEM_CALENDAR",
};
