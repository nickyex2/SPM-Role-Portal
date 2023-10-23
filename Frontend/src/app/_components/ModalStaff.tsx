"use client";
import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Modal, Button } from "flowbite-react";

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
      `http://localhost:5007/getStaffReportingOfficer/${staff_id}`
    );
    const reportingOfficer: TReportingOfficer = response.data.data
    const res = await axios.get(`http://localhost:5000/getStaff/${reportingOfficer.RO_id}`)
    return res.data.data;
  }
  async function getStaffRoles(staff_id: number): Promise<Array<TRoleDetails>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `http://localhost:5006/getStaffRolesOfSpecificStaff/${staff_id}`
    );
    const staffRoles: Array<Number> = [];
    response.data.data?.staff_roles.forEach((staffRole: TStaffRole) => {
      staffRoles.push(staffRole.staff_role);
    });
    const res = await axios.post(`http://localhost:5003/getRoles`, { role_ids: staffRoles })
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
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
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
              {staffRoles.map((role, idx) => {
                return (
                  <div key={idx}>
                    <p>{role.role_name}</p>
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
            </div>
          </Modal.Body>
        </Modal>
  )
}