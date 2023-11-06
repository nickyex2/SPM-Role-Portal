'use client';
import React from 'react';
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Table } from 'flowbite-react';
import Modal_Staff from '@/app/_components/ModalStaff';
import { FaSort } from "react-icons/fa";
import { BsPersonCheckFill, BsPersonXFill } from "react-icons/bs";

export default function Role_Applicants( { params } : { params: { role_listing_id: string } }) {
  const role_listing_id = params.role_listing_id;
  const [openModal, setOpenModal] = useState<string | undefined>();
  const [modalStaff, setModalStaff] = useState<TStaff>();
  const [modalSkills, setModalSkills] = useState<TSkillDetails[]>([]);
  const [modalRoleApplicant, setModalRoleApplicant] = useState<TRoleApplicant>({} as TRoleApplicant);
  const [userStaff, setUserStaff] = useState<TStaff>();
  const [roleApplicants, setRoleApplicants] = useState<Array<TRoleApplicant>>([]);
  const [applicantDetails, setApplicantDetails] = useState<Array<TStaff>>([]);
  const [applicantSkills, setApplicantSkills] = useState<TSpecificStaffSkills>({}); // [ { staff_id: 1, skills: [ { skill_id: 1, skill_name: 'skill_name', skill_level: 1 } ] }
  const [roleSkills, setRoleSkills] = useState<Array<TRoleSkills>>([]); 
  const [skills, setSkills] = useState<Array<TSkillDetails>>([]);
  const [loading, setLoading] = useState(true);
  const props = { openModal, setOpenModal, modalStaff, modalSkills, page: 'applicants', roleApplicant: modalRoleApplicant, userStaff: userStaff };
  async function getAllSkills(): Promise<Array<TSkillDetails>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `/api/skills/getAll`
    );
    return response.data.data?.skills;
  }
  async function getRoleListing(role_listing_id: number): Promise<TRoleListing> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `/api/role/roleListing/getOne/${role_listing_id}`
    );
    return response.data.data;
  }
  async function getRoleSkills(role_id: number): Promise<Array<TRoleSkills>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `/api/role/roleSkills/getByRole/${role_id}`
    );
    return response.data.data?.role_skills;
  }
  async function getRoleApplicants(role_listing_id: number): Promise<Array<TRoleApplicant>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `/api/role/roleapp/getOne/${role_listing_id}`
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
      `/api/staff/staffSkills/getMulti`,
      { staff_ids: staff_ids }
    );
    return response.data.data;
  }
 
  async function getOneStaff(staff_id: number): Promise<TStaff> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `/api/staff/getOne/${staff_id}`
    );
    return response.data.data;
}

// used in ModalStaff
  function updateRoleApplicantMain(currRoleApplicant: TRoleApplicant) {
    setModalRoleApplicant(currRoleApplicant)

    let new_role_applicants = [...roleApplicants]
    let index = new_role_applicants.findIndex((roleApplicant: TRoleApplicant) => roleApplicant.role_app_id === currRoleApplicant.role_app_id)
    new_role_applicants[index] = currRoleApplicant
    setRoleApplicants(new_role_applicants)
  }



  function getTime(date ?: Date) {
    return date != null ? date.getTime() : 0;
  }

  function handleSort(type: string) {
    if (type === "skill") {
      let sorted_role_applicants: Array<any> = []
      roleApplicants.forEach((roleApplicant: TRoleApplicant) => {
        const applicantSkill: number[] = applicantSkills[roleApplicant.staff_id];
        let applicantSkillPercentage: number = 0;
        if (applicantSkill) {
          let matchSkills = [];
          roleSkills.forEach((roleSkill: TRoleSkills) => {
            if (applicantSkill.includes(roleSkill.skill_id)) {
              matchSkills.push(roleSkill);
            }
          });
          applicantSkillPercentage = (matchSkills.length / roleSkills.length) * 100;
        }
        sorted_role_applicants.push([roleApplicant.role_app_id, applicantSkillPercentage]);
      });

      sorted_role_applicants.sort(function(a, b) {
        return b[1] - a[1];
      });
      console.log(sorted_role_applicants);

      let sorted_roleApplicants: Array<TRoleApplicant> = [];
      sorted_role_applicants.forEach((role_applicant: Array<any>) => {
        roleApplicants.find((roleApplicant: TRoleApplicant) => {
          if (roleApplicant.role_app_id === role_applicant[0]) {
            sorted_roleApplicants.push(roleApplicant);
          }
        });
      });

      console.log(sorted_roleApplicants);

      setRoleApplicants(sorted_roleApplicants);
    } else if (type === "time") {
      let sorted_role_applicants: Array<any> = []
      roleApplicants.forEach((roleApplicant: TRoleApplicant) => {
        sorted_role_applicants.push([roleApplicant.role_app_id, roleApplicant.role_app_ts_create]);
      });

      sorted_role_applicants.sort(function(a, b) {
        return getTime(new Date(b[1])) - getTime(new Date(a[1]));
        // return a[1].localeCompare(b[1])
      });
      console.log(sorted_role_applicants);

      let sorted_roleApplicants: Array<TRoleApplicant> = [];
      sorted_role_applicants.forEach((role_applicant: Array<any>) => {
        roleApplicants.find((roleApplicant: TRoleApplicant) => {
          if (roleApplicant.role_app_id === role_applicant[0]) {
            sorted_roleApplicants.push(roleApplicant);
          }
        });
      });

      console.log(sorted_roleApplicants);

      setRoleApplicants(sorted_roleApplicants);

    }
  
  }
  
  useEffect(() => {
    setLoading(true);
    getAllSkills().then((skills: Array<TSkillDetails>) => {
      setSkills(skills);
    });
    getRoleListing(Number(role_listing_id)).then((role: TRoleListing) => {
      getRoleSkills(role.role_id).then((roleSkills: Array<TRoleSkills>) => {
        setRoleSkills(roleSkills);
      })
      .catch((error: any) => {
        console.log(error);
      });
    });
    getRoleApplicants(Number(role_listing_id)).then((roleApplicants: Array<TRoleApplicant>) => {
      // setRoleApplicants(roleApplicants);
      let sorted_role_applicants: Array<TRoleApplicant> = []
      roleApplicants.forEach((roleApplicant: TRoleApplicant) => {
        if (roleApplicant.hr_checked === "supported") {
          sorted_role_applicants.unshift(roleApplicant);
        } else {
          sorted_role_applicants.push(roleApplicant);
        }
      setRoleApplicants(sorted_role_applicants);
      
      });
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
    })
    .catch((error: any) => {
      console.log(error);
      setLoading(false);
    });
    let userStaff = sessionStorage.getItem("staff_id")
    if (userStaff) {
      getOneStaff(parseInt(userStaff)).then((staff: TStaff) => {
        setUserStaff(staff);
      });
    }

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
            <Table.HeadCell className='cursor-pointer' onClick={() => {handleSort("time")}}>
              <span className="font-bold" >Applied Date <FaSort className='inline mb-0.5'></FaSort></span>
            </Table.HeadCell>
            <Table.HeadCell className='cursor-pointer' onClick={() => {handleSort("skill")}}>
              <span className="font-bold">Skill Match (%) <FaSort className='inline mb-0.5'></FaSort></span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="font-bold">HR Support</span>
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
              roleApplicants.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <span className="font-bold">No applicants</span>
                  </Table.Cell>
                </Table.Row>
              ) :
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
                  applicantSkillPercentage = (matchSkills.length / roleSkills.length) * 100 || 0;
                }
                return (
                  <Table.Row key={roleApplicant.role_app_id}>
                    <Table.Cell>
                      <span>{roleApplicant.role_app_id}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <a className='cursor-pointer hover:underline' onClick={() => {
                        setModalStaff(applicantDetail as TStaff);
                        setModalSkills(applicantSkillDetails);
                        setModalRoleApplicant(roleApplicant);
                        props.setOpenModal('pop-up-profile');
                      }}>{applicantDetail?.fname} {applicantDetail?.lname}</a>
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
                      {/* <Button size="xs" onClick={() => {
                        setModalStaff(applicantDetail as TStaff);
                        setModalSkills(applicantSkillDetails);
                        props.setOpenModal('pop-up-profile');
                      }}>View Profile</Button> */}
                      {roleApplicant.hr_checked === "supported" ? 
                      <div className='flex flex-col items-center'>
                        <BsPersonCheckFill className='w-7 h-7 text-green-500'></BsPersonCheckFill>
                        <p className='text-xs'>Supported</p>
                      </div>
                      :<div className='flex flex-col items-center'>
                        <BsPersonXFill className='w-7 h-7 text-red-700'></BsPersonXFill>
                        <p className='text-xs'>Unsupported</p>
                      </div>}
                    </Table.Cell>
                  </Table.Row>
                )
              })
            )}
          </Table.Body>
        </Table>
        <Modal_Staff props={props} updateRoleApplicantMain={updateRoleApplicantMain} />
      </div>
    </div>
  )
}

