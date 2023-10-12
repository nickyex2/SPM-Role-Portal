// Global Types

// Declare global variables

type TStaff = {
    staff_id: number;
    fname: string;
    lname: string;
    dept: string;
    email: string;
    phone: string;
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

type TSkillDetails = {
  skill_id: number,
  skill_name: string,
  skill_status: string
}

type TRoleListingChanges = {
  role_listing_id : number,
  change_no: number,
  role_listing_updater: number,
  log_time: EpochTimeStamp,
  changed_field: string,
  old_value: string,
  new_value: string
}

type TRoleApplication = {
  role_app_id: number,
  role_listing_id: number,
  staff_id: number,
  role_app_status: string,
}

type TReportingOfficer = {
  staff_id: number,
  RO_id: number
}

type TStaffSkill = {
  staff_id: number,
  skill_id: number,
  ss_status: string
}

type TStaffRole = {
  staff_id: number,
  staff_role: number,
  role_type: string,
  sr_status: string
}

type TRoleApplicant = {
  role_app_id: number,
  role_listing_id: number,
  staff_id: number,
  role_app_status: string,
  role_app_ts_create: EpochTimeStamp
}