'use client';
import React from 'react';
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Button, Modal, Table } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import Modal_Staff from '@/app/_components/ModalStaff';

export default function Role_Applicants( { params } : { params: { role_listing_id: string } }) {
  const router = useRouter();
  const role_listing_id = params.role_listing_id;
  const [openModal, setOpenModal] = useState<string | undefined>();
  const [modalStaff, setModalStaff] = useState<TStaff>();
  const [modalSkills, setModalSkills] = useState<TSkillDetails[]>([]);
  const [roleApplicants, setRoleApplicants] = useState<Array<TRoleApplicant>>([]);
  const [applicantDetails, setApplicantDetails] = useState<Array<TStaff>>([]);
  const [applicantSkills, setApplicantSkills] = useState<TSpecificStaffSkills>({}); // [ { staff_id: 1, skills: [ { skill_id: 1, skill_name: 'skill_name', skill_level: 1 } ] }
  const [role, setRole] = useState<TRoleListing | undefined>(undefined);
  const [roleSkills, setRoleSkills] = useState<Array<TRoleSkills>>([]); 
  const [skills, setSkills] = useState<Array<TSkillDetails>>([]);
  const [loading, setLoading] = useState(true);
  const props = { openModal, setOpenModal, modalStaff, modalSkills };
  async function getAllSkills(): Promise<Array<TSkillDetails>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `/api/skills/getAll`
    );
    return response.data.data?.skills;
  }
  async function getRoleListing(role_listing_id: number): Promise<TRoleListing> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `/api/roleListing/getOne/${role_listing_id}`
    );
    return response.data.data;
  }
  async function getRoleSkills(role_id: number): Promise<Array<TRoleSkills>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `/api/roleSkills/getByRole/${role_id}`
    );
    return response.data.data?.role_skills;
  }
  async function getRoleApplicants(role_listing_id: number): Promise<Array<TRoleApplicant>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `/api/roleApplication/getOne/${role_listing_id}`
    );
    return response.data.data;
  }
  async function getMultipleStaff(staff_ids: Array<number>): Promise<Array<TStaff>> {
    const response: AxiosResponse<TResponseData> = await axios.post(
      `/api/staff/getMulti`,
      { staff_ids: staff_ids }
    );
    return response.data.data?.staff;
  }
  async function getMultipleStaffSkills(staff_ids: Array<number>): Promise<TSpecificStaffSkills> {
    const response: AxiosResponse<TResponseData> = await axios.post(
      `/api/staffSkills/getMulti`,
      { staff_ids: staff_ids }
    );
    return response.data.data;
  }
  useEffect(() => {
    setLoading(true);
    getAllSkills().then((skills: Array<TSkillDetails>) => {
      setSkills(skills);
    });
    getRoleListing(Number(role_listing_id)).then((role: TRoleListing) => {
      setRole(role);
      getRoleSkills(role.role_id).then((roleSkills: Array<TRoleSkills>) => {
        setRoleSkills(roleSkills);
      });
    });
    getRoleApplicants(Number(role_listing_id)).then((roleApplicants: Array<TRoleApplicant>) => {
      setRoleApplicants(roleApplicants);
      const staff_ids: Array<number> = [];
      roleApplicants.forEach((roleApplicant: TRoleApplicant) => {
        staff_ids.push(roleApplicant.staff_id);
      });
      getMultipleStaff(staff_ids).then((staff: Array<TStaff>) => {
        setApplicantDetails(staff);
      });
      getMultipleStaffSkills(staff_ids).then((staffSkills: TSpecificStaffSkills) => {
        setApplicantSkills(staffSkills);
      });
      setLoading(false);
    });
  }, [role_listing_id])
  return (
    <div>
      <div className='mx-auto w-3/4 mt-10'>
        {/* <Button className='mb-5' onClick={() => {
          router.push(`/listroles/${role_listing_id}`)
        }}>
          <HiOutlineArrowLeft className="h-6 w-6" />
        </Button> */}
        <h1 className='text-3xl font-bold mb-4'>All Applicants</h1>
        <Table>
          <Table.Head>
            <Table.HeadCell>
              <span className="font-bold">Applicant ID</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="font-bold">Name</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="font-bold">Email</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="font-bold">Department</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="font-bold">Status</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="font-bold">Applied Date</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="font-bold">Role Skill %</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="font-bold">More Actions</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {loading ? (
              <Table.Row>
                <Table.Cell colSpan={6}>
                  <span className="font-bold">Loading...</span>
                </Table.Cell>
              </Table.Row>
            ) : (
              roleApplicants.map((roleApplicant: TRoleApplicant) => {
                const applicantDetail: TStaff | undefined = applicantDetails.find((staff: TStaff) => {
                  return staff.staff_id === roleApplicant.staff_id;
                });
                const applicantSkill: number[] = applicantSkills[roleApplicant.staff_id];
                const applicantSkillDetails: TSkillDetails[] = [];
                let applicantSkillPercentage: number = 0;
                if (applicantSkill) {
                  applicantSkill.forEach((skill_id: number) => {
                    const skillDetail: TSkillDetails | undefined = skills.find((skill: TSkillDetails) => {
                      return skill.skill_id === skill_id;
                    });
                    if (skillDetail) {
                      applicantSkillDetails.push(skillDetail);
                    }
                  });
                  let matchSkills = [];
                  roleSkills.forEach((roleSkill: TRoleSkills) => {
                    if (applicantSkill.includes(roleSkill.skill_id)) {
                      matchSkills.push(roleSkill);
                    }
                  });
                  applicantSkillPercentage = (matchSkills.length / roleSkills.length) * 100;
                }
                return (
                  <Table.Row key={roleApplicant.role_app_id}>
                    <Table.Cell>
                      <span>{roleApplicant.role_app_id}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span>{applicantDetail?.fname} {applicantDetail?.lname}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span>{applicantDetail?.email}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span>{applicantDetail?.dept}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span>{roleApplicant.role_app_status}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span>{roleApplicant.role_app_ts_create.toLocaleString()}</span>
                    </Table.Cell>
                    <Table.Cell>
                      {applicantSkillPercentage}%
                    </Table.Cell>
                    <Table.Cell>
                      <Button size="xs" onClick={() => {
                        setModalStaff(applicantDetail as TStaff);
                        setModalSkills(applicantSkillDetails);
                        props.setOpenModal('pop-up-profile');
                      }}>View Profile</Button>
                    </Table.Cell>
                  </Table.Row>
                )
              })
            )}
          </Table.Body>
        </Table>
        <Modal_Staff props={props} />
      </div>
    </div>
  )
}

