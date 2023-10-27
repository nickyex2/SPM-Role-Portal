"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Modal, Label, TextInput, Checkbox, Toast, Dropdown, Spinner } from "flowbite-react";
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

  const [roleTypes, setRoleTypes] = useState<Array<TRoleDetails>>([]);
  const [selectedRoleType, setSelectedRoleType] = useState<string>("Role Type");
  const [selectedRoleTypeID, setSelectedRoleTypeID] = useState<number>();

  const [allStaff, setAllStaff] = useState<Array<TStaff>>([]);
  const [selectedStaff, setSelectedStaff] = useState<string>("Select Hiring Manager");
  const [selectedStaffID, setSelectedStaffID] = useState<number>();

  const [selectedDescription, setSelectedDescription] = useState<string>("");

  const [selectedOpeningDate, setSelectedOpeningDate] = useState<Date>();
  const [selectedClosingDate, setSelectedClosingDate] = useState<Date>();
  const Today = new Date();

  
  const props = {
    openModal,
    setOpenModal,
    showToast,
    setShowToast,
    setRoles,
    setRoleDetails,
  };

  const getAllRolesURL = "/api/role/roleListing/getAll";
  const getRoleDetailsURL = "/api/role/getMulti";
  const getAllSkillsURL = "/api/skills/getAll";
  const getRoleSkillsURL = "/api/role/roleSkills/getMultiRole";
  const getAllRoleTypesURL = "/api/role/getAll";
  const getAllStaffURL = "/api/staff/getAll";

  const [selectedRole, setSelectedRole] = useState<TRoleListing | undefined>(undefined);

  const handleRoleClick = (role: TRoleListing) => {
    setSelectedRole(role);
  };

  async function getAllRoles(): Promise<Array<TRoleListing>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      getAllRolesURL
    );
    // console.log("getAllRoles: ", response.data.data?.role_listings);
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
    console.log("getRoleDetails: ", response.data.data);
    return response.data.data;
  }

  async function getAllSkills(): Promise<Array<TSkillDetails>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      getAllSkillsURL
    );
    // console.log("getAllSkills: ", response.data.data?.skills);
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
    console.log("getRoleSkills: ", response.data.data?.role_skills);
    return response.data.data;
  }

  async function getAllRoleTypes(): Promise<Array<TRoleDetails>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      getAllRoleTypesURL
    );
    // console.log("getAllRoleTypes: ", response.data.data?.roles);
    return response.data.data?.roles;
  }

  async function getAllStaff(): Promise<Array<TStaff>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      getAllStaffURL
    );
    // console.log("getAllStaff: ", response.data.data?.staffs);
    return response.data.data?.staffs;
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

  async function selectRoleType (roleType: TRoleDetails) {
    setSelectedRoleType(roleType.role_name);
    setSelectedRoleTypeID(roleType.role_id);
  }

  async function selectStaff (staff: TStaff) {
    setSelectedStaff(staff.fname + " " + staff.lname);
    setSelectedStaffID(staff.staff_id);

    console.log("STAFF ID", staff.staff_id);
  }

  async function createListing (selectedRoleTypeID:number, selectedDescription:string, selectedStaffID:number, selectedOpeningDate:Date, selectedClosingDate:Date) {
    // generate an 8 digit id, if not in roles, then use it, else generate another one
    let id = Math.floor(10000000 + Math.random() * 90000000);
    let idExists = false;
    roles.forEach((role) => {
      if (role.role_listing_id === id) {
        idExists = true;
      }
    });
    while (idExists) {
      id = Math.floor(10000000 + Math.random() * 90000000);
      roles.forEach((role) => {
        if (role.role_listing_id === id) {
          idExists = true;
        }
      });
    }

    // If opening date is after today, set status to inactive, else set to active
    let status = "active";

    // convert selectedOpeningDate which is a Date to a String of format YYYY-MM-DD
    let selectedOpeningDateStr = selectedOpeningDate.toISOString().split("T")[0];

    // convert selectedClosingDate which is a Date to a String of format YYYY-MM-DD
    let selectedClosingDateStr = selectedClosingDate.toISOString().split("T")[0];


    let sendData = {
      role_listing_id: id,
      role_id: selectedRoleTypeID,
      role_listing_desc: selectedDescription,
      role_listing_source: selectedStaffID,
      role_listing_open: selectedOpeningDateStr,
      role_listing_close: selectedClosingDateStr,
      role_listing_creator: sessionStorage.getItem("staff_id"),
      role_listing_status: status,
      role_listing_updater: sessionStorage.getItem("staff_id")
    };
    console.log(sendData)
    const response: AxiosResponse<TResponseData> = await axios.post(
      "http://localhost:5002/createRoleListing",
      sendData
    );
    console.log(response);
    if (response.data.code === 200) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      // Update roles and roleDetails
      getAllRoles()
        .then((data) => {
          // Fetch details for all roles concurrently using Promise.all
          setRoles(data);
          // console.log("setRoles<TRoleListings>: ", data);
          setInitialRoles(data);
          setSelectedRole(data[0]);
          let role_ids: Array<Number> = [];
          data.forEach((role) => {
            role_ids.push(role.role_id);
          });
          // console.log(role_ids);
          getRoleDetails(role_ids).then((data) => {
            setRoleDetails(data);
            console.log("ROLEDETAILSSS: ", data);
          });
          getRoleSkills(role_ids).then((data) => {
            setRoleSkills(data);
            setInitialRoleSkills(data);
            // console.log(data);
          });
        })
        .catch((error) => {
          console.error("Error fetching roles:", error);
          setLoading(false);
        });
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
        // console.log("setRoles<TRoleListings>: ", data);
        setInitialRoles(data);
        setSelectedRole(data[0]);
        let role_ids: Array<Number> = [];
        data.forEach((role) => {
          role_ids.push(role.role_id);
        });
        // console.log("role_ids: ", role_ids);
        getRoleDetails(role_ids).then((data) => {
          setRoleDetails(data);
          console.log("roleDetails: ", data);
        });
        getRoleSkills(role_ids).then((data) => {
          setRoleSkills(data);
          setInitialRoleSkills(data);
          console.log("initialRoleSkills: ", data);
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
        // console.log("skills: ", data);
        setInitialSkills(data);
      })
      .catch((error) => {
        console.error("Error fetching Skills:", error);
        setLoading(false);
      });

    getAllRoleTypes()
      .then((data) => {
        // Fetch details for all roles concurrently using Promise.all
        setRoleTypes(data);
        // console.log("RoleTypes: ", data);
      })
      .catch((error) => {
        // console.error("Error fetching Skills:", error);
        setLoading(false);
      });

    getAllStaff()
      .then((data) => {
        // Fetch details for all roles concurrently using Promise.all
        setAllStaff(data);
        // console.log("All Staff: ", data);
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
          <div>
            <Button
              type="button"
              onClick={() => {
                props.setOpenModal("pop-up-add");
              }}
              className="my-5 mx-auto"
            >
              New Listing
            </Button>
            <Modal show={props.openModal === 'pop-up-add'} size="md" popup onClose={() => props.setOpenModal(undefined)}>
              <Modal.Header />
              <Modal.Body>
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create new Role Listing</h3>

                  {/* Role Listing ID Input */}
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="role_id" value="Role ID" />
                    </div>
                    {/* For every role in roleType, create a dropdown input with a search function, limit to 5 dropdowns before adding scrollable */}
                    <Dropdown label={selectedRoleType} dismissOnClick={true}>
                      <div className="max-h-40 overflow-y-scroll">
                      {roleTypes.map((roleType) => {
                        return <Dropdown.Item onClick={() => selectRoleType(roleType)}>{roleType.role_name}</Dropdown.Item>;
                      })}
                      </div>
                    </Dropdown>
                  </div>


                  {/* Role Lister Creator Name prefilled based on the session user name */}
                  {/* <div>
                    <div className="mb-2 block">
                      <Label htmlFor="name" value="Lister Name" />
                    </div>
                    <TextInput id="name" placeholder="John Doe" value={sessionStorage.getItem("fname") + " " + sessionStorage.getItem("lname")} required />
                  </div> */}

                  {/* Role ID Input */}


                  {/* Role Listing Description Large Textarea Input */}
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="description" value="Description" />
                    </div>
                    <textarea id="description" className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" rows={4} placeholder="Description of role"
                    onBlur={(e) => setSelectedDescription(e.target.value)}
                    required />
                  </div>

                  {/* Role Listing Source Input, the Hiring Manager */}
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="role_id" value="Hiring Manager" />
                    </div>
                    {/* For every role in roleType, create a dropdown input with a search function, limit to 5 dropdowns before adding scrollable */}
                    <Dropdown label={selectedStaff} dismissOnClick={true}>
                      <div className="max-h-40 overflow-y-scroll">
                      {allStaff.map((staff) => {
                        return <Dropdown.Item onClick={() => selectStaff(staff)}>{staff.fname + " " + staff.lname}</Dropdown.Item>;
                      })}
                      </div>
                    </Dropdown>
                  </div>

                  {/* Role Listing Open Date Date style input */}
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="open_date" value="Opening Date" />
                    </div>
                    <input
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        setSelectedOpeningDate(selectedDate);
                      }}
                      type="date" id="open_date" className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" required />
                  </div>

                  {/* Role Listing Closing Date Date style Input */}
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="close_date" value="Closing Date" />
                    </div>
                    <input
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        setSelectedClosingDate(selectedDate);
                      }}
                      type="date" id="close_date" className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" required />
                  </div>

                  {/* If opening date is after Today, display a div as "inactive", otherwise display a div as "active" */}
                  {/* {selectedOpeningDate && Today ? (
                    selectedOpeningDate > Today ? (
                      <div className="bg-red-500 text-white text-center rounded-lg">
                        <p className="text-lg font-medium">Inactive</p>
                        <p className="text-sm">Opening Date is after Today</p>
                      </div>
                    ) : (
                      <div className="bg-green-500 text-white text-center rounded-lg">
                        <p className="text-lg font-medium">Active</p>
                        <p className="text-sm">Opening Date is before Today</p>
                      </div>
                    )
                  ) : null} */}

                  {/* Create Button */}
                  <div className="flex justify-end">
                    <Button onClick={() => createListing(selectedRoleTypeID as number, selectedDescription, selectedStaffID as number, selectedOpeningDate as Date, selectedClosingDate as Date)}>
                      Create Listing
                    </Button>
                  </div>

                  {/* Role Listing Updater Input */}
                  {/* <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember">Remember me</Label>
                    </div>
                    <a href="/modal" className="text-sm text-cyan-700 hover:underline dark:text-cyan-500">
                      Lost Password?
                    </a>
                  </div>
                  <div className="w-full">
                    <Button>Log in to your account</Button>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                    Not registered?&nbsp;
                    <a href="/modal" className="text-cyan-700 hover:underline dark:text-cyan-500">
                      Create account
                    </a>
                  </div> */}
                </div>
              </Modal.Body>
            </Modal>
          </div>
        ) : (<div className="my-6 mx-auto"></div>)}
        <div className="grid grid-cols-2 gap-0 mt-5">

          <div className="flex-1 bg-#fff border-black border-solid rounded max-w">
            {selectedRole ? (
            <RoleListings roles={roles} roleDetails={roleDetails} selectedRole={selectedRole} sysRole={sysRole} roleSkills={roleSkills} currUserSkills={currUserSkills} allStaff={allStaff} onRoleClick={handleRoleClick} />
            ) : (
              <p>No roles selected</p>
            )}
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