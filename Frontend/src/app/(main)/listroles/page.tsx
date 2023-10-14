"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Toast, Dropdown, Spinner } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import AddListing from "@/app/_components/AddListing";

import 'flowbite'

type TSpecificRoleSkills = {
  role_id: Array<number>,
}

export default function List_Roles() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<string | undefined>();
  const [showToast, setShowToast] = useState(false);
  const [roles, setRoles] = useState<Array<TRoleListing>>([]);
  const [roleDetails, setRoleDetails] = useState<Array<TRoleDetails>>([]);
  const [initialRoles, setInitialRoles] = useState<Array<TRoleListing>>([]);
  const [loading, setLoading] = useState(true);
  const [sysRole, setSysRole] = useState<string>("");
  const props = { openModal, setOpenModal, showToast, setShowToast, setRoles, setRoleDetails };
  const [searchBy, setSearchBy] = useState<string>("Search by");
  const [skills, setSkills] = useState<Array<TSkillDetails>>([]);
  const [initialSkills, setInitialSkills] = useState<Array<TSkillDetails>>([]);
  const [roleSkills, setRoleSkills] = useState<Array<TSpecificRoleSkills>>([]);
  const getAllRolesURL = "http://localhost:5002/getAllRoleListings";
  const getRoleDetailsURL = "http://localhost:5003/getRoles";
  const getAllSkillsURL = "http://localhost:5001/getAllSkills";
  const getAllRoleSkillsURL = "http://localhost:5002/getAllRoleSkills"

  async function getAllRoles(): Promise<Array<TRoleListing>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      getAllRolesURL
    );
    return response.data.data?.role_listings;
  }

  async function getRoleDetails(role_ids: Array<Number>): Promise<Array<TRoleDetails>> {
    let sendData = {
      role_ids: role_ids
    }
    const response: AxiosResponse<TResponseData> = await axios.post(
      getRoleDetailsURL, sendData
    );
    return response.data.data;
  }

  async function getAllSkills(): Promise<Array<TSkillDetails>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      getAllSkillsURL
    );
    return response.data.data?.skills;
  }

  async function getAllRoleSkills(role_ids: Array<Number>): Promise<Array<TSpecificRoleSkills>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      getAllRoleSkillsURL
    );
    return response.data.data
  }

  function handleSearch(searchInput: string) {
    // let search = document.getElementById("search-dropdown") as HTMLInputElement;
    // console.log(search.value);

    let search = searchInput

    if (searchBy === "Roles") {
      if (search === "") {
        setRoles(initialRoles);
        return;
      } else {
        let filteredRoles = roles.filter((role) => {
          return roleDetails.find((roleDetail) => roleDetail.role_id === role.role_id)?.role_name.toLowerCase().includes(search.toLowerCase());
        });
        console.log(filteredRoles);
        setRoles(filteredRoles);
      }
      
    } 
    // else if (searchBy === "Skills") {
    //   if (search === "") {
    //     setRoles(initialRoles);
    //     setSkills(initialSkills);
    //     return;
    //   } else {
    //     let filteredSkills = skills.filter((skill) => {
    //       return skill.skill_name.toLowerCase().includes(search.toLowerCase());
    //     });
    //     console.log(filteredSkills);
    //     setSkills(filteredSkills);

    //     let filteredRoleSkills = roleSkills.filter((roleSkill) => {
    //       return filteredSkills.find((filteredSkill) => filteredSkill.skill_id === roleSkill.skill_id);
    //     });
    //     console.log(filteredRoleSkills);
    //     let filteredRoles = roles.filter((role) => {
    //       return filteredRoleSkills.find((filteredRoleSkill) => filteredRoleSkill.role_id === role.role_id);
    //     });
    //     console.log(filteredRoles);
    //     setRoles(filteredRoles);
    //   }
    // }
  }

  useEffect(() => {
    setLoading(true);
    if (sessionStorage.getItem("staff_id") === null || sessionStorage.getItem("staff_id") === undefined) {
      router.push("/login");
    }
    getAllRoles()
      .then((data) => {
        // Fetch details for all roles concurrently using Promise.all
        setRoles(data);
        setInitialRoles(data);
        let role_ids: Array<Number> = [];
        data.forEach((role) => {
          role_ids.push(role.role_id);
        });
        getRoleDetails(role_ids)
          .then((data) => {
            setRoleDetails(data);
            console.log(data);
          })
        getAllRoleSkills(role_ids)
          .then((data) => {
            setRoleSkills(data);
            console.log(data);
          })
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        setLoading(false);
      });

    // getAllSkills()
    // .then((data) => {
    //   // Fetch details for all roles concurrently using Promise.all
    //   setSkills(data);
    //   setInitialSkills(data);
      
    // })
    // .catch((error) => {
    //   console.error("Error fetching Skills:", error);
    //   setLoading(false);
    // });
    
    setLoading(false);
  }, [router]);
  
  useEffect(() => {
    setSysRole(sessionStorage.getItem("sys_role") as string);
  }, []);

  

  return (
    loading ? ( 
      <div className='text-center'>
          <Spinner
          aria-label="Extra large spinner example"
          size="xl"
        /><h1>Loading...</h1>
      </div>
     ) : (
    <div>


      {/* SearchBar */}
      <section className={`bg-center bg-no-repeat backgroundSearch bg-gray-700 bg-blend-multiply`}>
      
        <div className="px-4 mx-auto max-w-screen-xl text-center py-10 lg:py-20">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
            All-In-One
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
            Expand your knowledge and grow your career!
          </p>
          <div className="flex flex-col space-y-4 place-items-center sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            
            <form className="w-2/3">
                <div className="flex ">
                    
                    {/* <button id="dropdown-button" data-dropdown-toggle="dropdown" className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">Search by<svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
              </svg></button>
                    <div id="dropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                          <li>
                              <button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" value={'role'}>Role</button>
                          </li>
                          <li>
                              <button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" value={'skill'}>Skill</button>
                          </li>
                        </ul>
                    </div> */}

                    
                        
                    <div className="relative w-full flex flex-row">
                      <div>
                      <Dropdown label={searchBy} dismissOnClick={true}>
                          <Dropdown.Item onClick={() => setSearchBy("Roles")}>Roles</Dropdown.Item>
                          <Dropdown.Item onClick={() => setSearchBy("Skills")}>Skills</Dropdown.Item>
                      </Dropdown>
                      </div>

                      <div className='grow'>
                      <input type="search" id="search-dropdown" className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Select Search parameters to start searching!" required 
                      
                      onChange={(e) => {
                        handleSearch(e.target.value);
                      }}

                      />
                      </div>
                      
                      <div>
                      <button type="submit" className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                            <span className="sr-only">Search</span>
                        </button>
                        <Button type="submit" className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full rounded-l-none">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                            <span className="sr-only">Search</span>
                        </Button>
                      </div>
                        
                    </div>
                </div>
            </form>

          </div>
        </div>

      </section>

      {/* SearchBar end */}


      <div className="flex items-stretch h-screen flex-col">
          {sysRole === "hr" || sysRole === "manager" ? (
            <Button
              type="button"
              onClick={() => {
                props.setOpenModal("pop-up-add");
              }}
              className="my-5 mx-auto"
            >
              New Listing
            </Button>
          ) : null}
        <div className="w-4/6 mx-auto">
          {roles?.map((role) => {
            const today = new Date();
            const roleListingOpenDate = new Date(role.role_listing_open);
            const timeDifference = today.getTime() - roleListingOpenDate.getTime();
            const daysSinceOpen = Math.floor(timeDifference / (1000 * 3600 * 24));
            return (
              <Link href={`/listroles/${role.role_listing_id}`} className="max-w p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mx-auto mb-4 grid grid-col-3 gap-2 hover:underline" key={role.role_listing_id}>

                {/* Image */}

                {/* roleList.TITLE */}
                <div className="col-span-2">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {roleDetails.find((roleDetail) => roleDetail.role_id === role.role_id)?.role_name}
                  </h5>
                </div>

                {/* role_listing_open, role_listing_status */}
                <div className="col-span-1 flex justify-end">
                  <div className="rounded-full bg-gray-300 p-2">
                    <p className="font-normal text-gray-700 dark:text-black">{daysSinceOpen} days ago</p>
                  </div>
                  <div className={`rounded-full p-2 ${role?.role_listing_status === 'active' ? 'bg-green-500': 'bg-red-500'}`}>
                    <p className="font-normal text-gray-700 dark:text-black">{role?.role_listing_status}</p>
                  </div>
                </div>

                {/* roleList.role_listing_source */}
                <div className="col-span-2">
                  <p className="font-normal text-gray-700 dark:text-gray-400">Hiring Manager: {role.role_listing_source}</p>
                </div>

                {/* roleList.role_listing_close */}
                <div className="col-span-2">
                  <p className="font-normal text-gray-700 dark:text-gray-400">Application Deadline: {role.role_listing_close}</p>
                </div>

                {/* role.role_listing_desc */}
                <div className="col-span-3">
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Job Description:<br />
                    {role.role_listing_desc.length > 200
                    ? role.role_listing_desc.slice(0, 200) + "..."
                    : role.role_listing_desc}
                  </p>
                </div>
            </Link>
            );
          })}
        </div>
        <AddListing props={props} staff_id={parseInt(sessionStorage.getItem("staff_id") as string)} />
        {showToast ? (
        <Toast className="fixed bottom-5 right-5">
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
          <HiCheck className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">
          Role Listing added successfully.
        </div>
        <Toast.Toggle onDismiss={() => props.setShowToast(false)} />
      </Toast>
      ): null}
      </div>
    </div>
    )
  );
}
