"use client";
import React from "react";
import "flowbite";
import dateFormat from "dateformat";

type RoleListingProps = {
  roles: TRoleListing[];
  roleDetails: TRoleDetails[];
  selectedRole: TRoleListing;
  sysRole: string;
  roleSkills: TSpecificRoleSkills;
  currUserSkills: number[];
  allStaff: TStaff[];
  onRoleClick: (role: TRoleListing) => void;
  allSkills: TSkillDetails[];
};

export default function RoleListings( {roles, roleDetails, selectedRole, sysRole, roleSkills, currUserSkills, allStaff, onRoleClick, allSkills}:RoleListingProps ) {
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
  function matchColour(percentMatch: number) {
    if (percentMatch < 40) {
      return(
        <p className='text-2xl text-center md:text-2xl font-bold text-red-600'>
                  {
                    percentMatch + "%"
                  }
                  <p className='text-4xl font-bold text-center md:text-xl font-bold text-left text-gray-900 dark:text-white'>Skill Match</p>
                </p>
      )
    } else if (percentMatch > 40 && percentMatch < 70) {
      return (
        <p className='text-2xl text-center md:text-2xl font-bold text-orange-400'>
                  {
                    percentMatch + "%"
                  }
                  <p className='text-4xl font-bold text-center md:text-xl font-bold text-left text-gray-900 dark:text-white'>Skill Match</p>
                </p>
      )
    } else {
      return (
        <p className='text-2xl text-center md:text-2xl font-bold text-green-600'>
                  {
                    percentMatch + "%"
                  }
                  <p className='text-4xl font-bold text-center md:text-xl font-bold text-left text-gray-900 dark:text-white'>Skill Match</p>
                </p>
      )
    }
  }
  return (
    <div className="w-4/5 h-[60vh] overflow-y-scroll ml-auto">
      {roles?.map((role) => {
            const isSelected = selectedRole && selectedRole.role_listing_id === role.role_listing_id;
            const backgroundColor = isSelected ? "bg-blue-200" : "bg-white";
            const hoverStyles = isSelected ? "" : "hover:bg-gray-100 dark:hover:bg-gray-700";
            return (
              <div
                // href={`/listroles/${role.role_listing_id}`}
                className={`max-w p-4 border border-gray-200 rounded-lg shadow ${hoverStyles} ${backgroundColor} mx-auto mb-2 grid grid-cols-3 gap-1 hover:underline dark:bg-gray-800 dark:border-gray-700`}
                key={role.role_listing_id}
                onClick={() => onRoleClick(role)}
              >

                {/* roleList.TITLE */}
                <div className="col-span-3">
                  <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                    {
                      roleDetails.find(
                        (roleDetail) => roleDetail.role_id === role.role_id
                      )?.role_name
                    }
                  </h5>
                </div>

                {/* Department, How many days posted ago */}
                <div className="col-span-3">
                  <div className="flex items-center">
                    <p className="font-normal text-sm text-gray-700 dark:text-white">
                      {/* Convert this from all capital to first letter capital with the remaining lower */}
                      {/* {roleListingSource?.dept?.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())} */}
                      {allStaff.find((staff) => staff.staff_id === role.role_listing_source)?.dept}
                    </p>
                  </div>
                </div>

                {/* roleList.role_listing_close */}
                <div className="col-span-2">
                  <p className="font-normal text-sm text-gray-700 dark:text-gray-400">
                    Application Deadline: {dateFormat(role.role_listing_close, "dd mmmm yyyy")}
                  </p>
                </div>


                <div className="col-span-3 flex justify-end">
                  <div>
                    <p className="font-normal text-sm text-gray-700 dark:text-white">
                      {
                        matchColour(roleSkills[role.role_id]?.filter((skill) =>
                        currUserSkills.includes(skill)
                      ).length / roleSkills[role.role_id]?.length * 100 || 0)
                      }
                    </p>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <p className="font-normal text-gray-700 dark:text-white">
                    {roleSkills[role.role_id]? (
                    roleSkills[role.role_id].map((skill) => {
                      
                      let skillDetail = allSkills.find((skillDetail) => skillDetail.skill_id === skill);

                      if (currUserSkills.includes(skill)) {
                        console.log("Skill", skill)
                        return (
                          <span key={skill} className="inline-block bg-green-200 rounded-full px-3 py-1 text-[10px] font-semibold text-gray-700 mr-2 mb-2">
                            {skillDetail ? skillDetail.skill_name : `Skill ${skill}`}
                          </span>
                        );
                      }
                      else {
                        return (
                          <span key={skill} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-[10px] font-semibold text-gray-700 mr-2 mb-2">
                            {skillDetail ? skillDetail.skill_name : `Skill ${skill}`}
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
  );
}