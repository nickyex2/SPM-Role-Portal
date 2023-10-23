"use client";
import React, { use } from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Toast, Dropdown, Spinner } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import AddListing from "@/app/_components/AddListing";
import "flowbite";

type RoleListingProps = {
  roles: TRoleListing[];
  roleDetails: TRoleDetails[];
  selectedRole: TRoleListing;
  sysRole: string;
  roleSkills: TSpecificRoleSkills;
  currUserSkills: number[];
  onRoleClick: (role: TRoleListing) => void;
};

export default function RoleListings( {roles, roleDetails, selectedRole, sysRole, roleSkills, currUserSkills, onRoleClick}:RoleListingProps ) {
  const [loading, setLoading] = useState(true);
  
  // async function getRoleListingSource(selectedRole): Promise<TStaff | undefined> {
  //   try {
  //     const response: AxiosResponse<TResponseData> = await axios.get(
  //       `http://localhost:5000/getStaff/${selectedRole.role_listing_source}`
  //     );
  //     console.log("response.data.data: ", response.data.data);
  //     return response.data.data;
  //   }
  //   catch (error: any) {
  //     if (error?.response?.status === 404){
  //       console.log("No role application found");
  //     }
  //     return undefined;
  //   }
  // }

  useEffect(() => {
    setLoading(false);
  }
  , []);
  

  return (
    loading ? (
      <div className="text-center">
      <Spinner aria-label="Extra large spinner example" size="xl" />
      <h1>Loading...</h1>
    </div>
  ) : (
    <div className="w-4/5 h-[60vh] overflow-y-scroll ml-auto">
      {roles?.map((role) => {
            const isSelected = selectedRole && selectedRole.role_listing_id === role.role_listing_id;
            const backgroundColor = isSelected ? "bg-blue-200" : "bg-white";
            const hoverStyles = isSelected ? "" : "hover:bg-gray-100 dark:hover:bg-gray-700";

            const today = new Date();
            const roleListingOpenDate = new Date(role.role_listing_open);
            const timeDifference =
              today.getTime() - roleListingOpenDate.getTime();
            const daysSinceOpen = Math.floor(
              timeDifference / (1000 * 3600 * 24)
            );

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

            const roleSkillsDetails = getSkillDetails(roleSkills[role.role_id]);
            console.log("ROLESKILLSDETAILS: " ,roleSkillsDetails);
            console.log("ROLESKILLS: " ,roleSkills[role.role_id])

            return (
              <div
                // href={`/listroles/${role.role_listing_id}`}
                className={`max-w p-4 border border-gray-200 rounded-lg shadow ${hoverStyles} ${backgroundColor} mx-auto mb-2 grid grid-cols-3 gap-1 hover:underline`}
                key={role.role_listing_id}
                onClick={() => onRoleClick(role)}
              >
                {/* Image */}

                {/* roleList.TITLE */}
                <div className="col-span-2">
                  <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                    {
                      roleDetails.find(
                        (roleDetail) => roleDetail.role_id === role.role_id
                      )?.role_name
                    }
                  </h5>
                </div>

                {/* roleList.role_listing_close */}
                <div className="col-span-2">
                  <p className="font-normal text-sm text-gray-700 dark:text-gray-400">
                    Application Deadline: {role.role_listing_close}
                  </p>
                </div>

                {/* Department, How many days posted ago */}
                <div className="col-span-1">
                  <div className="flex items-center">
                    <p className="font-normal text-sm text-gray-700 dark:text-black">
                      {/* Convert this from all capital to first letter capital with the remaining lower */}
                      {/* {roleListingSource?.dept?.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())} */}
                    </p>
                  </div>
                </div>

                <div className="col-span-3 flex justify-end">
                  <div>
                    <p className="font-normal text-sm text-gray-700 dark:text-black">
                      {
                        (roleSkills[role.role_id]?.filter((skill) =>
                          currUserSkills.includes(skill)
                        ).length / roleSkills[role.role_id]?.length * 100 || 0)
                      } %
                      <br />
                      Skill Match
                    </p>
                  </div>
                </div>
                
                <div className="col-span-3">
                  <p className="font-normal text-gray-700 dark:text-black">
                    {roleSkills[role.role_id]? (
                    roleSkills[role.role_id].map((skill) => {

                      if (currUserSkills.includes(skill)) {
                        console.log("Skill", skill)
                        return (
                          <span key={skill} className="inline-block bg-green-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2">
                            {skill}
                          </span>
                        );
                      }
                      else {
                        return (
                          <span key={skill} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2">
                            {skill}
                          </span>
                        );
                      }
                    })
                    ): null}
                  </p>
                </div>
              </div>
            );
          })}
    </div>
  )
  )
}