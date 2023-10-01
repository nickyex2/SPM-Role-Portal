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
  role_listing_source: string;
  role_listing_open: Date;
  role_listing_close: Date;
  role_listing_status: string;
  role_listing_creator: number;
  role_listing_ts_create: EpochTimeStamp;
  role_listing_ts_updater: number;
  role_listing_ts_update: EpochTimeStamp;
}

type TResponseData = {
  code: number;
  data: any;
}