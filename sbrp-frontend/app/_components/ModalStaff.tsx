"use client";
import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Modal, Button } from "flowbite-react";
import { HiUser } from "react-icons/hi";
import { time } from "console";
import { format } from "path";

export default function Modal_Staff({
  props,
  updateRoleApplicantMain
}: {
  props: {
    openModal: string | undefined;
    setOpenModal: React.Dispatch<React.SetStateAction<string | undefined>>;
    modalStaff: TStaff | undefined;
    modalSkills: Array<TSkillDetails>;
    page: string | undefined;
    roleApplicant: TRoleApplicant;
    userStaff: TStaff | undefined;
  };
  updateRoleApplicantMain: (roleApplicant: TRoleApplicant) => void;
}) {
  const [reportingOfficer, setReportingOfficer] = useState<TStaff | undefined>(undefined);
  const [staffRoles, setStaffRoles] = useState<Array<TRoleDetails>>([]);
  const [loading, setLoading] = useState(true);
  async function getReportingOfficer(staff_id: number): Promise<TStaff> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `/api/staff/staffRO/getOne/${staff_id}`
    );
    const reportingOfficer: TReportingOfficer = response.data.data
    const res = await axios.get(`/api/staff/getOne/${reportingOfficer.RO_id}`)
    return res.data.data;
  }
  async function getStaffRoles(staff_id: number): Promise<Array<TRoleDetails>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `/api/staff/staffRole/getByStaff/${staff_id}`
    );
    const staffRoles: Array<Number> = [];
    response.data.data?.staff_roles.forEach((staffRole: TStaffRole) => {
      staffRoles.push(staffRole.staff_role);
    });
    const res = await axios.post(`/api/role/getMulti`, { role_ids: staffRoles })
    return res.data.data;
  }
  async function updateRoleApplicant(hr_checked: string, role_app_id: number) {
    const response: AxiosResponse<TResponseData> = await axios.put(
      `/api/role/roleapp/update/${role_app_id}`,
      { role_app_status:"applied", hr_checked: hr_checked }
    );
    
    return response.data.data;

  }
  
  // function formatTimestamp(timestamp: number | null) {
  //   if (timestamp) {
  //     const date = new Date(timestamp);
  //     // return in the form DD MM YYYY HH:MM:SS
  //     return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  //     // return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  //   }
    
  // }

  function formatTimestamp(timestamp: number | null) {
    if (timestamp) {
      
      const date = new Date(timestamp);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
    
      // Convert to GMT by subtracting the UTC offset
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    
      const day = days[date.getUTCDay()];
      const dayOfMonth = date.getUTCDate();
      const month = months[date.getUTCMonth()];
      const year = date.getUTCFullYear();
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    
      return `${day}, ${dayOfMonth} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;
  }
      
  }

  useEffect(() => {
    setLoading(true);
    if (props.modalStaff) {
      getReportingOfficer(props.modalStaff.staff_id).then((reportingOfficer: TStaff) => {
        setReportingOfficer(reportingOfficer);
      });
      getStaffRoles(props.modalStaff.staff_id).then((staffRoles: Array<TRoleDetails>) => {
        setStaffRoles(staffRoles);
      });
    }
    setLoading(false);
  }, [props.modalStaff]);
  return (
    <Modal show={props.openModal === 'pop-up-profile'} size="md" popup onClose={() => props.setOpenModal(undefined)}>
          <Modal.Header>
          <div className="flex flex-row items-right gap-4">
          <HiUser className='mb-3 rounded-full shadow-lg' size={96}/>
                  <div className='my-auto'>
                    <div className='flex flex-col'>
                      <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                        {props.modalStaff?.fname} {props.modalStaff?.lname}
                      </h5>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                      {props.modalStaff?.dept}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {staffRoles.map((role, idx) => {
                          return (
                            
                              <span key={idx}>{role.role_name} </span>
                            
                          )
                        }
                        )}
                      </span>
                      
                    </div>
                    
                  </div>
                  
            </div>
          </Modal.Header>

          <Modal.Body>
            <div className="space-y-6 mb-8">
              <div className='flex flex-col items-right my-2'>
                <h1 className="text-xl font-semibold mb-1">Employee Details</h1>

                <p>
                  <strong>Email:</strong> {props.modalStaff?.email}
                </p>
                <p>
                  <strong>Phone:</strong> {props.modalStaff?.phone}
                </p>
                <p>
                  <strong>Reporting Officer:</strong> {reportingOfficer?.fname} {reportingOfficer?.lname}
                </p>
              </div>

              <div className='flex flex-col items-right my-4'>
                <h1 className="text-xl font-semibold mb-1">Skills</h1>
                {props.modalSkills.map((skill, idx) => {
                  return (
                    <div key={idx}>
                      <p>{skill.skill_name}</p>
                    </div>
                  )
                }
                )}
              </div>

            </div>

            {/* <div className="text-center">
              <h1 className="text-3xl font-bold">Profile</h1>
              <p>{props.modalStaff?.lname} {props.modalStaff?.fname}</p>
              <p>{props.modalStaff?.email}</p>
              <p>{props.modalStaff?.dept}</p>
              <p>{props.modalStaff?.phone}</p>
              {props.modalSkills.map((skill, idx) => {
                return (
                  <div key={idx}>
                    <p>{skill.skill_name}</p>
                  </div>
                )
              }
              )}
              
              <p>{reportingOfficer?.fname} {reportingOfficer?.lname}</p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => props.setOpenModal(undefined)}>
                  {`Back To All Applicants`}
                </Button>
              </div>
            </div> */}


            {/* for later */}
            {
              props.page === 'applicants' && props.userStaff?.sys_role !== 'manager' ? 
        
                props.roleApplicant.role_app_status !== "withdrawn" ?

                  props.roleApplicant.hr_checked === "pending" ?
                
                    <div className="flex flex-row justify-center gap-4">
                      <Button color='success' pill
                      onClick={() => {
                        // update db
                        props.roleApplicant.hr_checked = "supported"
                        // props.roleApplicant.hr_checked_ts = Date.now()
                        updateRoleApplicant("Supported", props.roleApplicant.role_app_id)
                        updateRoleApplicantMain(props.roleApplicant)
                        console.log(props.roleApplicant)
                      }}>
                        {`Support Application`}
                      </Button>
                      <Button color='light' pill
                      onClick={() => {
                        // update db
                        props.roleApplicant.hr_checked = "unsupported"
                        // props.roleApplicant.hr_checked_ts = Date.now()
                        updateRoleApplicant("Unsupported", props.roleApplicant.role_app_id)
                        updateRoleApplicantMain(props.roleApplicant)
                        console.log(props.roleApplicant)
                      }}>
                        {`Unsupport Application`}
                      </Button>
                    </div>
                  : props.roleApplicant.hr_checked === "supported" ?
                      <div className='text-center'>
                        <p>Application has been supported on</p> 
                        {/* {props.roleApplicant?.hr_checked_ts} */}
                        {props.roleApplicant.hr_checked_ts ? 
                          formatTimestamp(props.roleApplicant.hr_checked_ts)
                          : formatTimestamp(Date.now())
                          }
                      </div>
                  : props.roleApplicant.hr_checked === "unsupported" ?
                      <div className='text-center'>
                        <p>Application was unsupported on</p> 
                        {props.roleApplicant.hr_checked_ts ? 
                          formatTimestamp(props.roleApplicant.hr_checked_ts)
                          : formatTimestamp(Date.now())
                          }
                      </div>
                  : null

                : props.roleApplicant.role_app_status === "withdrawn" ?
                    <div>Application has been withdrawn</div>
                : null
                
            : null}
              
          </Modal.Body>
        </Modal>
  )
}