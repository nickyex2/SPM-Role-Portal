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
  sysRole: string;
  roleSkills: TSpecificRoleSkills;
  currUserSkills: number[];
  onRoleClick: (role: TRoleListing) => void;
};

export default function RoleListings( {roles, roleDetails, sysRole, roleSkills, currUserSkills, onRoleClick}:RoleListingProps ) {
  const [loading, setLoading] = useState(true);
  

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
    <div className="w-4/5 mx-auto h-[60vh] overflow-y-scroll">
      {roles?.map((role) => {
            const today = new Date();
            const roleListingOpenDate = new Date(role.role_listing_open);
            const timeDifference =
              today.getTime() - roleListingOpenDate.getTime();
            const daysSinceOpen = Math.floor(
              timeDifference / (1000 * 3600 * 24)
            );
            return (
              <div
                // href={`/listroles/${role.role_listing_id}`}
                className="max-w p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mx-auto mb-2 grid grid-cols-3 gap-2 hover:underline"
                key={role.role_listing_id}
                onClick={() => onRoleClick(role)}
              >
                {/* Image */}

                {/* roleList.TITLE */}
                <div className="col-span-2">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {
                      roleDetails.find(
                        (roleDetail) => roleDetail.role_id === role.role_id
                      )?.role_name
                    }
                  </h5>
                </div>

                {/* role_listing_open, role_listing_status */}
                {/* <div className="col-span-1 flex justify-end">
                  <div className="rounded-full bg-gray-300 p-2">
                    <p className="font-normal text-gray-700 dark:text-black">
                      {daysSinceOpen} days ago
                    </p>
                  </div>
                  {sysRole === "hr" || sysRole === "manager" ? (
                    <div
                      className={`rounded-full p-2 ${
                        role?.role_listing_status === "active"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      <p className="font-normal text-gray-700 dark:text-black">
                        {role?.role_listing_status}
                      </p>
                    </div>
                      ) : null
                  }
                </div> */}

                {/* roleList.role_listing_source */}
                {/* <div className="col-span-2">
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Hiring Manager: {role.role_listing_source}
                  </p>
                </div> */}

                {/* roleList.role_listing_close */}
                <div className="col-span-2">
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Application Deadline: {role.role_listing_close}
                  </p>
                </div>

                {/* role.role_listing_desc */}
                {/* <div className="col-span-3">
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Job Description:
                    <br />
                    {role.role_listing_desc.length > 200
                      ? role.role_listing_desc.slice(0, 200) + "..."
                      : role.role_listing_desc}
                  </p>
                </div> */}
                {/* role skill match % */}
                {/* <div className="col-span-3">
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Skill Match %:
                    <br />
                    {
                      (roleSkills[role.role_id]?.filter((skill) =>
                        currUserSkills.includes(skill)
                      ).length / roleSkills[role.role_id]?.length * 100 || 0) 
                    } %
                  </p>
                </div> */}
                <div className="col-span-1 mx-auto">
                  <div>
                    <p className="font-normal text-gray-700 dark:text-black">
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
                          <span key={skill} className="inline-block bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                            {skill}
                          </span>
                        );
                      }
                      else {
                        return (
                          <span key={skill} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
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