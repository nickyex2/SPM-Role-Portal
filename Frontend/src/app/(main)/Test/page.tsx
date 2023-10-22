"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Toast, Dropdown, Spinner } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import AddListing from "@/app/_components/AddListing";
import "flowbite";
import RoleListings from "../../_components/RoleListings";
import RoleDetails from "../../_components/RoleDetails";

export default function Test() {
  const router = useRouter();
  
  const [openModal, setOpenModal] = useState<string | undefined>();
  const [showToast, setShowToast] = useState(false);

  const [loading, setLoading] = useState(true);

  const [searchBy, setSearchBy] = useState<string>("Roles");
  const [roles, setRoles] = useState<Array<TRoleListing>>([]);
  const [initialRoles, setInitialRoles] = useState<Array<TRoleListing>>([]);
  const [roleDetails, setRoleDetails] = useState<Array<TRoleDetails>>([]);

  const [roleSkills, setRoleSkills] = useState<TSpecificRoleSkills>({});
  const [initailRoleSkills, setInitialRoleSkills] = useState<TSpecificRoleSkills>({});
  const [skills, setSkills] = useState<Array<TSkillDetails>>([]);
  const [initialSkills, setInitialSkills] = useState<Array<TSkillDetails>>([]);
  const [currUserSkills, setCurrUserSkills] = useState<Array<number>>([]);
  
  const [sysRole, setSysRole] = useState<string>("");

  
  const props = {
    openModal,
    setOpenModal,
    showToast,
    setShowToast,
    setRoles,
    setRoleDetails,
  };

  const getAllRolesURL = "http://localhost:5002/getAllRoleListings";
  const getRoleDetailsURL = "http://localhost:5003/getRoles";
  const getAllSkillsURL = "http://localhost:5001/getAllSkills";
  const getRoleSkillsURL = "http://localhost:5008/getSpecificRoleSkills";

  const [selectedRole, setSelectedRole] = useState<TRoleListing | undefined>(undefined);

  const handleRoleClick = (role: TRoleListing) => {
    setSelectedRole(role);
  };

  async function getAllRoles(): Promise<Array<TRoleListing>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      getAllRolesURL
    );
    return response.data.data?.role_listings;
  }

  async function getRoleDetails(
    role_ids: Array<Number>
  ): Promise<Array<TRoleDetails>> {
    let sendData = {
      role_ids: role_ids,
    };
    const response: AxiosResponse<TResponseData> = await axios.post(
      getRoleDetailsURL,
      sendData
    );
    return response.data.data;
  }

  async function getAllSkills(): Promise<Array<TSkillDetails>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      getAllSkillsURL
    );
    return response.data.data?.skills;
  }

  async function getRoleSkills(
    role_ids: Array<Number>
  ): Promise<TSpecificRoleSkills> {
    const response: AxiosResponse<TResponseData> = await axios.post(
      getRoleSkillsURL,
      {
        role_ids: role_ids,
      }
    );
    return response.data.data;
  }

  function handleSearch(searchInput: string) {
    // let search = document.getElementById("search-dropdown") as HTMLInputElement;
    // console.log(search.value);

    let search = searchInput;

    if (searchBy === "Roles") {
      if (search === "") {
        setRoles(initialRoles);
        return;
      } else {
        let filteredRoles = roles.filter((role) => {
          return roleDetails
            .find((roleDetail) => roleDetail.role_id === role.role_id)
            ?.role_name.toLowerCase()
            .includes(search.toLowerCase());
        });
        console.log(filteredRoles);
        setRoles(filteredRoles);
      }
    } else if (searchBy === "Skills") {
      if (search === "") {
        setRoles(initialRoles);
        setRoleSkills(initailRoleSkills);
        setSkills(initialSkills);
        return;
      } else {
        let filteredSkills = skills.filter((skill) => {
          return skill.skill_name.toLowerCase().includes(search.toLowerCase());
        });
        console.log(filteredSkills);
        // filter roleSkills based on filteredSkills
        let filteredRoleSkills: Array<number> = [];
        filteredSkills.forEach((filteredSkill) => {
          Object.entries(roleSkills).forEach((roleSkill) => {
            // based on filteredSkill.skill_id, check if roleSkill array contains it
            if (
              roleSkill[1].includes(filteredSkill.skill_id) &&
              !filteredRoleSkills.includes(parseInt(roleSkill[0]))
            ) {
              filteredRoleSkills.push(parseInt(roleSkill[0]));
            }
          });
        });
        let filteredRoles: TRoleListing[] = roles.filter((role) => {
          return filteredRoleSkills.includes(role.role_id);
        });
        console.log(filteredRoles);
        setRoles(filteredRoles);
      }
    }
  }

  useEffect(() => {
    setLoading(true);
    if (
      sessionStorage.getItem("staff_id") === null ||
      sessionStorage.getItem("staff_id") === undefined
    ) {
      router.push("/login");
    }
    setCurrUserSkills(JSON.parse(sessionStorage.getItem("skills") as string));
    getAllRoles()
      .then((data) => {
        // Fetch details for all roles concurrently using Promise.all
        setRoles(data);
        console.log("setRoles<TRoleListings>: ", data);
        setInitialRoles(data);
        setSelectedRole(data[0]);
        let role_ids: Array<Number> = [];
        data.forEach((role) => {
          role_ids.push(role.role_id);
        });
        console.log(role_ids);
        getRoleDetails(role_ids).then((data) => {
          setRoleDetails(data);
          console.log(data);
        });
        getRoleSkills(role_ids).then((data) => {
          setRoleSkills(data);
          setInitialRoleSkills(data);
          console.log(data);
        });
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        setLoading(false);
      });

    getAllSkills()
      .then((data) => {
        // Fetch details for all roles concurrently using Promise.all
        setSkills(data);
        console.log(data);
        setInitialSkills(data);
      })
      .catch((error) => {
        console.error("Error fetching Skills:", error);
        setLoading(false);
      });

    setLoading(false);
  }, [router]);

  useEffect(() => {
    setSysRole(sessionStorage.getItem("sys_role") as string);
  }, []);


  return loading ? (
    <div className="text-center">
      <Spinner aria-label="Extra large spinner example" size="xl" />
      <h1>Loading...</h1>
    </div>
  ) : (
    <div>
      <div>
        {/* SearchBar */}
        <section
          className={`bg-center bg-no-repeat backgroundSearch bg-gray-700 bg-blend-multiply`}
        >
          <div className="px-4 mx-auto max-w-screen-xl text-center py-10 lg:py-6">
            {/* <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-3xl lg:text-4xl">
              All-In-One
            </h1> */}
            <p className="mb-4 text-lg font-normal text-gray-300 lg:text-lg sm:px-16 lg:px-48">
              Expand your knowledge and grow your career!
            </p>
            <div className="flex flex-col space-y-4 place-items-center sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <form className="w-2/3">
                <div className="flex ">
                  <div className="relative w-full flex flex-row">
                    <div>
                      <Dropdown label={searchBy} dismissOnClick={true}>
                        <Dropdown.Item onClick={() => setSearchBy("Roles")}>
                          Roles
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setSearchBy("Skills")}>
                          Skills
                        </Dropdown.Item>
                      </Dropdown>
                    </div>
                    <div className="grow">
                      <input
                        type="search"
                        id="search-dropdown"
                        className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                        placeholder="Select Search parameters to start searching!"
                        required
                        onChange={(e) => {
                          handleSearch(e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        <svg
                          className="w-4 h-4"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                          />
                        </svg>
                        <span className="sr-only">Search</span>
                      </button>
                      <Button
                        type="submit"
                        className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full rounded-l-none"
                      >
                        <svg
                          className="w-4 h-4"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                          />
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
      </div>
      {/* RoleListings */}
      <div className="flex items-stretch h-full flex-col">
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
        <div className="grid grid-cols-2 gap-0">

          <div className="flex-1 bg-#fff border-black border-solid rounded max-w">
            <RoleListings roles={roles} roleDetails={roleDetails} sysRole={sysRole} roleSkills={roleSkills} currUserSkills={currUserSkills} onRoleClick={handleRoleClick} />
          </div>

          <div>
            {selectedRole ? (
              <RoleDetails selectedRole={selectedRole} roleDetails={roleDetails} sysRole={sysRole} roleSkills={roleSkills} currUserSkills={currUserSkills} />
            ) : (
              <p>No role selected</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}