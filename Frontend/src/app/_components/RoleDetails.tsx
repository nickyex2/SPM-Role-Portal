"use client";
import React, { use } from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Modal, Label, TextInput, Checkbox,  Toast, Dropdown, Spinner } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import AddListing from "@/app/_components/AddListing";
import "flowbite";


type RoleDetailsProps = {
  selectedRole: TRoleListing;
  roleDetails: TRoleDetails[];
  sysRole: string;
  roleSkills: TSpecificRoleSkills;
  currUserSkills: number[];
};

export default function RoleDetails( {selectedRole, sysRole, roleSkills, currUserSkills}:RoleDetailsProps ) { //, roleDetails
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState<string | undefined>(undefined);
  const [showToast, setShowToast] = useState(false);
  const [appliedRole, setAppliedRole] = useState<TRoleApplication | undefined>(undefined);
  const [roleDetails, setRoleDetails] = useState<TRoleDetails | undefined>(undefined);
  const [roleSkillsDetails, setRoleSkillsDetails] = useState<Array<TSkillDetails>>([]);
  const [skillMatchCounter, setSkillMatchCounter] = useState<number>(0);
  const [roleListingChanges, setRoleListingChanges] = useState<Array<TRoleListingChanges>>([]);
  const [roleListingSource, setRoleListingSource] = useState<TStaff | undefined>(undefined); 
  
  const props = { openModal, setOpenModal, showToast, setShowToast }; //setRole, setRoleListingChanges
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const today = new Date();
  const roleListingOpenDate = new Date(selectedRole.role_listing_open);
  const timeDifference = today.getTime() - roleListingOpenDate.getTime();
  const daysSinceOpen = Math.floor(timeDifference / (1000 * 3600 * 24));

  async function getRoleDetails(): Promise<TRoleDetails> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `http://localhost:5003/getRole/${selectedRole?.role_listing_id}`
    );
    return response.data.data;
  }

  async function getRoleSkills(): Promise<Array<TRoleSkills>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `http://localhost:5008/getRoleSkills/${selectedRole?.role_listing_id}`
    );
    console.log("role_skills: ", response.data.data?.role_skills);
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
      `http://localhost:5002/getRoleListingChanges/${selectedRole.role_listing_id}`
    );
    return response.data.data?.role_listing_changes;
    }
    catch (error: any) {
      if (error.response.code === 404){
        console.log("No role listing changes found");
      }
      return [];
    }
  }

  async function getAppliedRole(): Promise<TRoleApplication | undefined> {
    try {
      const response: AxiosResponse<TResponseData> = await axios.get(
        `http://localhost:5005/getRoleApplication/${selectedRole.role_listing_id}/${sessionStorage.getItem("staff_id")}`
      );
      console.log("response.data.data: ", response.data.data);
      return response.data.data;
    }
    catch (error: any) {
      if (error.response.code === 404){
        console.log("No role application found");
      }
      return undefined;
    }
  }

  async function getRoleListingSource(): Promise<TStaff | undefined> {
    try {
      const response: AxiosResponse<TResponseData> = await axios.get(
        `http://localhost:5000//getStaff/${selectedRole.role_listing_source}`
      );
      console.log("response.data.data: ", response.data.data);
      return response.data.data;
    }
    catch (error: any) {
      if (error?.response?.status === 404){
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
      props.setOpenModal(undefined);
      setShowSuccessToast(true);
    } else {
      props.setOpenModal(undefined);
      setShowErrorToast(true);
    }
    props.setOpenModal(undefined);
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
    setLoading(true);
  }
  , [selectedRole.role_listing_id]);
  if (selectedRole && loading) {
    getRoleDetails().then((data) => {
      setRoleDetails(data);
      // console.log("roleDetails: ", data);
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
        // console.log("skillMatchCounter: ",data);
      });
    });
    getRoleListingChanges().then((data) => {
      setRoleListingChanges(data);
      // console.log("roleListingChanges", data);
    });
    getAppliedRole().then((data) => {
      if (data) {
        setAppliedRole(data);
        // console.log("appliedRole: ", data);
      }
    });
    getRoleListingSource().then((data) => {
      if (data) {
        setRoleListingSource(data);
        // console.log("roleListingSource: ", data);
      }
    });
    setLoading(false);
  }
  

  return (
    loading ? (
      <div className="text-center">
      <Spinner aria-label="Extra large spinner example" size="xl" />
      <h1>Loading...</h1>
    </div>
  ) : (
    <div className="w-4/5 mx-auto h-[60vh] overflow-y-scroll">
      <div className="max-w p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto mb-2 grid grid-cols-4 gap-2">
        {/* Title */}
        <div className="col-span-3">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {roleDetails?.role_name}
          </h5>
        </div>
        {/* Apply Button */}
        <div className="col-span-1">
          {appliedRole && appliedRole.role_app_status !== "withdrawn" ? (
            <Button onClick={() => {
              withdrawRole(appliedRole);
            }}>Withdraw</Button>
          ) : <div>
            <Button onClick={() => {
              props.setOpenModal("pop-up-apply");
            }}>Apply</Button>
            <Modal show={props.openModal === "pop-up-apply"} size="md" popup onClose={() => props.setOpenModal(undefined)}>
              <Modal.Header />
              <Modal.Body>
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">Confirm Application?</h3>
                  <h6>Your application will be submitted to the hiring team.</h6>

                  <div className="flex gap-5 justify-end">
                    <Button className="bg-gray-300" onClick={() => props.setOpenModal(undefined)}>Cancel</Button>
                    <Button onClick={() => applyRole(selectedRole?.role_listing_id as number, parseInt(sessionStorage.getItem("staff_id") as string))}>Confirm</Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>

            {showSuccessToast && (
              <Toast>
                <div className="ml-3 text-sm font-normal">Successful Application!</div>
                <Toast.Toggle onDismiss={() => props.setShowToast(false)} />
              </Toast>
            )}
            {showErrorToast && (
              <Toast>
                Error in Application
              </Toast>
            )}
          </div>

          
          }
        </div>

        {/* Department, How many days posted ago */}
        <div className="col-span-1">
          <div className="flex items-center">
            <p className="font-normal text-gray-700 dark:text-black">
              {/* Convert this from all capital to first letter capital with the remaining lower */}
              {roleListingSource?.dept?.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
            </p>
          </div>
        </div>
        <div className="col-span-2">
          <div className="flex items-center">
            <p className="font-normal text-gray-700 dark:text-black">
              Posted {daysSinceOpen} days ago
            </p>
          </div>
        </div>

        {/* Closing Date */}
        <div className="col-span-4">
          <div className="flex items-center">
            <p className="font-normal text-gray-700 dark:text-black">
              Application Deadline: {selectedRole?.role_listing_close}
            </p>
          </div>
        </div>

        {/* Hiring Manager (email) */}
        <div className="col-span-4">
          <div className="flex items-center">
            <p className="font-normal text-gray-700 dark:text-black">
              Hiring Manager: {roleListingSource?.fname?.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())} 
              <span className="text-blue-500">({roleListingSource?.email})</span>
            </p>
          </div>
        </div>

        {/* Skill Match */}
        <div className="col-span-1">
          <p className="font-normal text-gray-700 dark:text-black">
            Skill Match:
            <br />
            {
              (roleSkills[selectedRole.role_id]?.filter((skill) =>
                currUserSkills.includes(skill)
              ).length / roleSkills[selectedRole.role_id]?.length * 100 || 0) 
            } %
          </p>
        </div>
        
        <div className="col-span-3">
          <p className="font-normal text-gray-700 dark:text-black">
            {roleSkillsDetails.map((skill) => {
              console.log("SkillDeets", skill)
              if (currUserSkills.includes(skill.skill_id)) {
                return (
                  <span key={skill.skill_name} className="inline-block bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {skill.skill_name}
                  </span>
                )
              }
              else {
                return (
                  <span key={skill.skill_name} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {skill.skill_name}
                  </span>
                )
              }
            })}
          </p>
        </div>
        
        

        {/* Role Description */}
        <div className="col-span-4">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Role Description
          </h5>
        </div>
        <div className="col-span-4">
          <p className="font-normal text-gray-700 dark:text-black">
            {selectedRole.role_listing_desc}
          </p>
        </div>

      </div>
    </div>
  )
  )
}