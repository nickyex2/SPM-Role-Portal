"use client";
import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Modal, Button } from "flowbite-react";
import { HiUser } from "react-icons/hi";

export default function Modal_Staff({
  props,
}: {
  props: {
    openModal: string | undefined;
    setOpenModal: React.Dispatch<React.SetStateAction<string | undefined>>;
    modalStaff: TStaff | undefined;
    modalSkills: Array<TSkillDetails>;
  };
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
            {/* {
              page === 'applicants' ? 
                
                  <div className="flex flex-row justify-center gap-4">
                    <Button color='success' pill>
                      {`Accept Applicant`}
                    </Button>
                    <Button color='light' pill>
                      {`Reject Applicant`}
                    </Button>
                  </div>
                
            : null} */}
              
          </Modal.Body>
        </Modal>
  )
}