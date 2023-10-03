// Global Types

// Declare global variables

type TStaff = {
    id: number;
    fname: string;
    lname: string;
    dept: string;
    email: string;
    phone: string;
    role: string[];
    manager: string | null;
    skills: string[];
    sys_role: string;
}

type TRoleListing = {
  role_listing_id: number;
  role_id: number;
  role_listing_desc: string;
  role_listing_source: number;
  role_listing_open: string;
  role_listing_close: string;
  role_listing_status: string;
  role_listing_creator: number;
  role_listing_ts_create: EpochTimeStamp;
  role_listing_updater: number;
  role_listing_ts_update: EpochTimeStamp;
}

type TRoleDetails = {
  role_id: number;
  role_name: string;
  role_description: string;
  role_status: string;
}

type TSkillDetails = {
  skill_id: number;
  skill_name: string;
  skill_status: string;
}

type TRoleSkills = {
  role_id: number;
  skill_id: number;
}

type TResponseData = {
  code: number;
  data: any;
}