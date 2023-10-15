"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge, Button, Modal, Toast } from "flowbite-react";
import { useRouter } from "next/navigation";
import { HiOutlineCheckCircle, HiCheck } from 'react-icons/hi'
import EditListing from "@/app/_components/EditListing";

export default function Role_Listing_Profile( { params } : { params: { role_listing_id: string } }) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<string | undefined>(undefined);
  const [showToast, setShowToast] = useState(false);
  const [currUserSkills, setCurrUserSkills] = useState<Array<Number>>([]);
  const [skillMatchCounter, setSkillMatchCounter] = useState<number>(0);
  const [role, setRole] = useState<TRoleListing | undefined>(undefined);
  const [roleDetails, setRoleDetails] = useState<TRoleDetails | undefined>(undefined);
  const [roleSkillsDetails, setRoleSkillsDetails] = useState<Array<TSkillDetails>>([]);
  const [roleListingChanges, setRoleListingChanges] = useState<Array<TRoleListingChanges>>([]);
  const [appliedRole, setAppliedRole] = useState<TRoleApplication | undefined>(undefined);
  const props = { openModal, setOpenModal, showToast, setShowToast, setRole, setRoleListingChanges };
  const [loading, setLoading] = useState(true);
  async function getRoleDetails(): Promise<TRoleDetails> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `http://localhost:5003/getRole/${role?.role_id}`
    );
    return response.data.data;
  }

  async function getRoleSkills(): Promise<Array<TRoleSkills>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `http://localhost:5008/getRoleSkills/${role?.role_id}`
    );
    return response.data.data?.role_skills;
  }
  async function getSkillDetails(roleSkills: Array<Number>): Promise<Array<TSkillDetails>>{
    let sendData = {
      skill_ids: roleSkills
    }
    const response: AxiosResponse<TResponseData> = await axios.post(
      `http://localhost:5001/getSkills`,
      sendData
    );
    return response.data.data;
  }
  async function getRoleListingChanges(): Promise<Array<TRoleListingChanges>> {
    try {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `http://localhost:5002/getRoleListingChanges/${params.role_listing_id}`
    );
    return response.data.data?.role_listing_changes;
    }
    catch (error: any) {
      if (error.response.status === 404){
        console.log("No role listing changes found");
      }
      return [];
    }
  }
  async function getAppliedRole(): Promise<TRoleApplication | undefined> {
    try {
      const response: AxiosResponse<TResponseData> = await axios.get(
        `http://localhost:5005/getRoleApplication/${params.role_listing_id}/${sessionStorage.getItem("staff_id")}`
      );
      return response.data.data;
    }
    catch (error: any) {
      if (error.response.status === 404){
        console.log("No role application found");
      }
      return undefined;
    }
  }
  async function applyRole(role_listing_id: number, staff_id: number) {
    const sendApplication = {
      role_listing_id: role_listing_id,
      staff_id: staff_id,
      role_app_status: "applied"
    }
    const response: AxiosResponse<TResponseData> = await axios.post(
      `http://localhost:5005/createRoleApplication`,
      sendApplication
    );
    if (response.status === 201) {
      props.setOpenModal('pop-up-applied');
    }
  }
  async function withdrawRole(roleApplication: TRoleApplication) {
    const response: AxiosResponse<TResponseData> = await axios.put(
      `http://localhost:5005/updateRoleApplication/${roleApplication.role_app_id}`,
      {
        ...roleApplication,
        role_app_status: "withdrawn"
      }
    );
    if (response.status === 200) {
      props.setOpenModal('pop-up-withdraw');
    }
  }
  useEffect(() => {
    async function getRoleListing(): Promise<TRoleListing> {
      const response: AxiosResponse<TResponseData> = await axios.get(
        `http://localhost:5002/getRoleListing/${params.role_listing_id}`
      );
      return response.data.data;
    }
    setLoading(true);
    setCurrUserSkills(JSON.parse(sessionStorage.getItem("skills") as string));
    getRoleListing().then((data) => {
      setRole(data);
      console.log(data);
    });
    
  }
  , [params.role_listing_id]);
  if (role && loading) {
    getRoleDetails().then((data) => {
      setRoleDetails(data);
      console.log(data);
    });
    getRoleSkills().then((data) => {
      let skills: Array<Number> = [];
      data.forEach((roleSkill) => {
        skills.push(roleSkill.skill_id);
      });
      getSkillDetails(skills).then((data) => {
        setRoleSkillsDetails(data);
        var counter = 0;
        data.map((skill) => {
          if (currUserSkills.includes(skill.skill_id)) {
            counter += 1;
          }
        })
        setSkillMatchCounter(counter);
        console.log(data);
      });
    });
    getRoleListingChanges().then((data) => {
      setRoleListingChanges(data);
      console.log(data);
    });
    getAppliedRole().then((data) => {
      if (data) {
        setAppliedRole(data);
        console.log(data);
      }
    });
    setLoading(false);
  }
  return (
    loading ? ( <h1>Loading...</h1> ) : (
    <div>
      <div className="mt-5 flex mb-3">
        {roleSkillsDetails.map((roleSkill, idx) => {
          if (currUserSkills.includes(roleSkill.skill_id)) {
            return (
              <Badge color="success" key={idx} className="mx-3">
                {roleSkill.skill_name}
              </Badge>
            )
          }
          return (
            <Badge color="failure" key={idx} className="mx-3">
              {roleSkill.skill_name}
            </Badge>
          )
        })}
      </div>
      <span className="m-3">
        {
          Math.round((skillMatchCounter / roleSkillsDetails.length) * 100) + "% Match"
        }
      </span>
      <form className="mt-5">
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="mb-6">
            <label htmlFor="role_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role ID</label>
            <input 
              type="text" 
              name="role_id" 
              id="role_id" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Role ID"
              defaultValue={role?.role_id || ''} 
              required 
            />
          </div>
          <div className="mb-6">
            <label htmlFor="role_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role Name</label>
            <input 
              type="text" 
              name="role_name" 
              id="role_name" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Role ID"
              defaultValue={roleDetails?.role_name || ''} 
              required 
            />
          </div>          
        </div>
        <div className="mb-6">
          <label htmlFor="role_desc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role Description</label>
          <input
            type="text"
            id="role_desc"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Role Description"
            required
            defaultValue={role?.role_listing_desc || ''}
          />
        </div>

        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="mb-6">
            <label htmlFor="role_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role ID</label>
            <input 
              type="text" 
              name="role_id" 
              id="role_id" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Role ID"
              defaultValue={role?.role_id || ''} 
              required 
            />
          </div>
          <div className="mb-6">
            <label htmlFor="role_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role ID</label>
            <input 
              type="text" 
              name="role_id" 
              id="role_id" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Role ID"
              defaultValue={role?.role_id || ''} 
              required 
            />
          </div>          
        </div>

        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="mb-6">
            <label htmlFor="role_listing_open" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role Opening Date</label>
            <input 
              type="text" 
              name="role_listing_open" 
              id="role_listing_open" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Role Opening Date"
              defaultValue={role?.role_listing_open || ''} 
              required 
            />
          </div>
          <div className="mb-6">
            <label htmlFor="skills_required" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Skills Required</label>
            <input 
              type="text" 
              name="skills_required" 
              id="skills_required" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Skills Required"
              defaultValue={role?.role_listing_open || ''} 
              required 
            />
          </div>          
        </div>
      </form>
      {appliedRole && appliedRole.role_app_status !== "withdrawn" ? (
        <Button onClick={() => {
          withdrawRole(appliedRole);
        }}>Withdraw</Button>
      ) : <Button onClick={() => {
        applyRole(role?.role_listing_id as number, parseInt(sessionStorage.getItem("staff_id") as string));
      }}>Apply</Button>
      }
      {sessionStorage.getItem("sys_role") === "hr" || parseInt(sessionStorage.getItem("staff_id") as string) === role?.role_listing_source ? (
        <div>
          <Button onClick={() => {
            router.push(`/listroles/${params.role_listing_id}/applicants`)
          }}>
            View Applicants
          </Button>
          <Button onClick={() => {
            props.setOpenModal('pop-up-edit');
          }}>
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="30px" height="30px">    <path d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 19 6 L 24 11 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 17 8 L 5.2597656 19.740234 C 5.2597656 19.740234 6.1775313 19.658 6.5195312 20 C 6.8615312 20.342 6.58 22.58 7 23 C 7.42 23.42 9.6438906 23.124359 9.9628906 23.443359 C 10.281891 23.762359 10.259766 24.740234 10.259766 24.740234 L 22 13 L 17 8 z M 4 23 L 3.0566406 25.671875 A 1 1 0 0 0 3 26 A 1 1 0 0 0 4 27 A 1 1 0 0 0 4.328125 26.943359 A 1 1 0 0 0 4.3378906 26.939453 L 4.3632812 26.931641 A 1 1 0 0 0 4.3691406 26.927734 L 7 26 L 5.5 24.5 L 4 23 z"/>
            </svg>
          </Button>
        </div>
      ): null}
      <Button type="button" onClick={()=>{router.push('/listroles')}}>Return to All Listings</Button>
      <Modal show={props.openModal === 'pop-up-applied'} size="md" popup onClose={() => props.setOpenModal(undefined)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineCheckCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Successfully Applied For Role
            </h3>
            <div className="flex justify-center gap-4">
              <Button onClick={() => router.push('/listroles')}>
                {`Back To Listings`}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={props.openModal === 'pop-up-withdraw'} size="md" popup onClose={() => props.setOpenModal(undefined)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineCheckCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Withdrawn Role Application Successfully
            </h3>
            <div className="flex justify-center gap-4">
              <Button onClick={() => router.push('/listroles')}>
                {`Back To Listings`}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <EditListing roleListing={role as TRoleListing} role_listing_id={role?.role_listing_id as number} props={props} />
      {showToast ? (
        <Toast className="fixed bottom-5 right-5">
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
          <HiCheck className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">
          Role Listing edited successfully.
        </div>
        <Toast.Toggle onDismiss={() => props.setShowToast(false)} />
      </Toast>
      ): null}
    </div>
  )
  );
}