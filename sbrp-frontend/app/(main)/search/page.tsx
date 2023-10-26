"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, Fragment } from "react";
import { Spinner, TextInput, Table, Dropdown, Button, Badge } from "flowbite-react";
import { Combobox, Transition } from '@headlessui/react'
import { HiOutlineChevronDoubleDown, HiOutlineCheck } from "react-icons/hi"
import { TableCell } from "flowbite-react/lib/esm/components/Table/TableCell";
import { init } from "next/dist/compiled/webpack/webpack";

export default function SearchStaff() {
  const router = useRouter();
  const [skills, setSkills] = useState<Array<TSkillDetails>>([]);
  const [staff, setStaff] = useState<Array<TStaff>>([]);
  const [initialStaff, setInitialStaff] = useState<Array<TStaff>>([]);
  const [staffSkills, setStaffSkills] = useState<TSpecificStaffSkills>({});
  const [searchBy, setSearchBy] = useState<string>("Skills"); // ["Skills", "Name"]
  const [searchedSkills, setSearchedSkills] = useState<Array<TSkillDetails>>([]);
  const [roles, setRoles] = useState<Array<TRoleListing>>([]);
  const [roleDetails, setRoleDetails] = useState<Array<TRoleDetails>>([])
  const [loading, setLoading] = useState<boolean>(true);

  const [selected, setSelected] = useState<TRoleDetails|undefined>(undefined)
  const [query, setQuery] = useState('')    
  const [filteredRoles, setFilteredRoles] = useState<Array<TRoleDetails>>([])
  const [filteredRoleSkills, setFilteredRoleSkills] = useState<TSpecificRoleSkills>({}) 
  const [filteredRoleSkillDetails, setFilteredRoleSkillDetails] = useState<Array<TSkillDetails>>([])
  const [tableSkillSort, setTableSkillSort] = useState<boolean>(false)
  const [sortSkills, setSortSkills] = useState<TSpecificStaffSkills>({})

  async function getAllStaff(): Promise<TStaff[]> {
    const res: AxiosResponse<TResponseData> = await axios.get(
      "/api/staff/getAll"
    );
    return res.data.data?.staffs;
  }
  async function getMultipleStaffSkills(
    staff_ids: Array<number>
  ): Promise<TSpecificStaffSkills> {
    const response: AxiosResponse<TResponseData> = await axios.post(
      `/api/staff/staffSkills/getMulti`,
      { staff_ids: staff_ids }
    );
    return response.data.data;
  }
  async function getAllSkills(): Promise<Array<TSkillDetails>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      "/api/skills/getAll"
    );
    return response.data.data?.skills;
  }

  async function getRoleSkills(
    role_ids: Array<Number>
  ): Promise<TSpecificRoleSkills> {
    const response: AxiosResponse<TResponseData> = await axios.post(
      '/api/role/roleSkills/getMultiRole',
      {
        role_ids: role_ids,
      }
    );
    return response.data.data;
  }

  async function getAllRoles(): Promise<Array<TRoleListing>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      "/api/role/roleListing/getAll"
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
      "/api/role/getMulti",
      sendData
    );
    return response.data.data;
  }

  // function handleSearch(search: string) {
  //   // on search, filter skills first, then filter staffskills to get staff_ids then filter staff
  //   // search === "", reset to initialStaff and initialSkills
  //   if (search === "") {
  //     setStaff(initialStaff);
  //     return;
  //   }
  //   if (searchBy === "Skills") {
  //     // filter skills
  //     // let searchedSkills: Array<string> = []
  //     let filteredSkills = skills.filter((skill) => {
  //       // searchedSkills.push(skill.skill_name)
  //       return skill.skill_name.toLowerCase().includes(search.toLowerCase());
  //     });
  //     setSearchedSkills(filteredSkills)
  //     console.log(searchedSkills)
  //     // filter staffskills to get staff_ids
  //     let staff_ids: Array<number> = [];
  //     filteredSkills.forEach((skill) => {
  //       // if skill.skill_id is in staffSkills, add staff_id to staff_ids
  //       Object.entries(staffSkills).forEach(([staff_id, staffSkills]) => {
  //         if (
  //           staffSkills.includes(skill.skill_id) &&
  //           !staff_ids.includes(Number(staff_id))
  //         ) {
  //           staff_ids.push(Number(staff_id));
  //         }
  //       });
  //     });
  //     // filter staff
  //     let filteredStaff = staff.filter((staff) => {
  //       return staff_ids.includes(staff.staff_id);
  //     });
  //     setStaff(filteredStaff);
  //   } else if (searchBy === "Name") {
  //     let filteredStaff = staff.filter((staff) => {
  //       return (
  //         staff.fname.toLowerCase().includes(search.toLowerCase()) ||
  //         staff.lname.toLowerCase().includes(search.toLowerCase())
  //       );
  //     });
  //     setStaff(filteredStaff);
  //   }
  // }

  // testing button onClick
  // function handleSearch() {
    // on search, filter skills first, then filter staffskills to get staff_ids then filter staff
    // search === "", reset to initialStaff and initialSkills
  //   const search = (document.getElementById("search-dropdown") as HTMLInputElement).value;
    
  //   if (search === "") {
  //     setStaff(initialStaff);
  //     setSearchedSkills([])
  //     return;
  //   }
  //   if (searchBy === "Skills" && search !== "") {
  //     // filter skills
  //     setStaff(initialStaff);
  //     setSearchedSkills([])
  //     let allSearchedSkills: Array<string> = []
  //     search.split(",").forEach((search) => {
  //       allSearchedSkills.push(search.trim())
  //     })
  //     // console.log(allSearchedSkills)
  //     let filteredSkills: Array<TSkillDetails> = []
  //     // iterate thorugh allSearchedSkills and match them with skills from skills by skill_name and push to filteredSkills
  //     allSearchedSkills.forEach((search) => {
  //       skills.forEach((skill) => {
  //         if (skill.skill_name.toLowerCase().includes(search.toLowerCase())) {
  //           filteredSkills.push(skill)
  //         }
  //       })
  //     })
  //     console.log(filteredSkills)
  //     setSearchedSkills(filteredSkills)
  //     // filter staffskills to get staff_ids
  //     let staff_ids: Array<number> = [];
  //     filteredSkills.forEach((skill) => {
  //       // if skill.skill_id is in staffSkills, add staff_id to staff_ids
  //       Object.entries(staffSkills).forEach(([staff_id, staffSkills]) => {
  //         if (
  //           staffSkills.includes(skill.skill_id) &&
  //           !staff_ids.includes(Number(staff_id))
  //         ) {
  //           staff_ids.push(Number(staff_id));
  //         }
  //       });
  //     });
  //     // filter staff
  //     let filteredStaff = [...initialStaff].filter((staff) => {
  //       return staff_ids.includes(staff.staff_id);
  //     });
  
  //     setStaff(filteredStaff);
  //   } else if (searchBy === "Name") {
  //     let filteredStaff = staff.filter((staff) => {
  //       return (
  //         staff.fname.toLowerCase().includes(search.toLowerCase()) ||
  //         staff.lname.toLowerCase().includes(search.toLowerCase())
  //       );
  //     });
  //     setStaff(filteredStaff);
  //   }
  // }

  function searchRoles(query: string) {

    if (query === "") {
      setFilteredRoles(roleDetails)
      setStaff(initialStaff)
      setFilteredRoleSkillDetails([])
    } else {
      let role_filtered: Array<TRoleDetails> = []
      roleDetails.forEach((role) => {
        if (
          role.role_name
            .toLowerCase()
            .includes(query.toLowerCase())
        ) {
          role_filtered.push(role);
        }
      });
      setFilteredRoles(role_filtered);
    }
  }

  function handleClick(role_id: number) {
    getRoleSkills([role_id]).then((res) => {
      setFilteredRoleSkills(res);
      // console.log(res);
    })
 
    let skills_match: Array<TSkillDetails> = []

    Object.entries(filteredRoleSkills).forEach(([role_id, roleSkills]) => {
      roleSkills.forEach((skill_id) => {
        skills.forEach((skill) => {
          if (skill_id === skill.skill_id) {
            skills_match.push(skill)
          }
        })
      })
    })

    setFilteredRoleSkillDetails(skills_match)

    getAllStaff().then((res) => {
      let staff_ids: Array<number> = [];
      res.forEach((staff) => {
        staff_ids.push(staff.staff_id);
      });
      getMultipleStaffSkills(staff_ids).then((res) => {
        setStaffSkills(res);
        console.log(staffSkills)
      });
    });

    let filtered_staff_ids: Array<number> = [];

    Object.entries(staffSkills).forEach(([staff_id, staffSkillArr]) => {
      let skill_id_array: Array<number> = []
      Object.entries(filteredRoleSkills).forEach(([role_id, roleSkills]) => {
        roleSkills.forEach((skill_id) => {
          if (staffSkillArr.includes(skill_id)) {
            skill_id_array.push(skill_id)
          }
        })
      })

      if (skill_id_array.length >= 3) {
        filtered_staff_ids.push(Number(staff_id));
      }
    })

    let filteredStaff = [...initialStaff].filter((staff) => {
      return filtered_staff_ids.includes(staff.staff_id);
    });

    setStaff(filteredStaff);


  }


  useEffect(() => {
    if (sessionStorage.getItem("sys_role") !== "hr") {
      router.push("/");
    }
  }, [router]);
  useEffect(() => {
    getAllSkills().then((res) => {
      setSkills(res);
    });
    getAllStaff().then((res) => {
      setStaff(res);
      setInitialStaff(res);
      let staff_ids: Array<number> = [];
      res.forEach((staff) => {
        staff_ids.push(staff.staff_id);
      });
      getMultipleStaffSkills(staff_ids).then((res) => {
        setStaffSkills(res);
      });
    });
    getAllRoles()
      .then((res) => {
        // Fetch details for all roles concurrently using Promise.all
        setRoles(res);
        let role_ids: Array<Number> = [];
        res.forEach((role) => {
          role_ids.push(role.role_id);
        });
        console.log(role_ids);
        getRoleDetails(role_ids).then((res) => {
          setRoleDetails(res);
          setFilteredRoles(res);
          console.log(res);
        });
    setLoading(false);
    })
}, []);
 
  return loading ? (
    <div className="text-center">
      <Spinner aria-label="Extra large spinner example" size="xl" />
      <h1>Loading...</h1>
    </div>
  ) : (
    <>
      <div className="flex flex-col mx-4 mt-4">
          <div className='flex flex-row my-4 w-full h-8'>
            <div className="z-10 w-72">
              <Combobox value={selected} onChange={setSelected}>
                <div className="relative mt-1">
                  <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <Combobox.Input
                      className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                      // displayValue={(person) => person.name}
                      placeholder="Search Staff"
                      onChange={(e) => {
                        setQuery(e.target.value)
                        searchRoles(e.target.value)
                      }}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <HiOutlineChevronDoubleDown
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                  >

                  <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredRoles.length === 0 && query !== '' ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      filteredRoles.map((role) => (
                        <Combobox.Option
                        key={role.role_id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-teal-600 text-white' : 'text-gray-900'
                          }`
                        }
                        value={role.role_name || ''}
                        onClick={() => {handleClick(role.role_id) 
                          console.log(role.role_id)}}

                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {role.role_name}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-white' : 'text-teal-600'
                                }`}
                              >
                                <HiOutlineCheck className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                  </Transition>
                </div>
              </Combobox>
            </div>

            {filteredRoleSkillDetails.map((skill) => {
              return (
                <Badge color='info' className='mx-2 my-2 px-2 py-1'>
                  {skill.skill_name}
                </Badge>

              )
            })}


          
        </div>

       <Button onClick={() => {
          setTableSkillSort(!tableSkillSort)
          let staff_ids: Array<number> = [];
          staff.forEach((staff) => {
            staff_ids.push(staff.staff_id);
          });
          getMultipleStaffSkills(staff_ids).then((res) => {
            setSortSkills(res);
          });
          console.log(sortSkills)
          // if (tableSkillSort) {
          //   let sortedStaff = [...staff].sort((a, b) => {
          //     return a.staff_id - b.staff_id
          //   })
          //   setStaff(sortedStaff)
          // } else {
          //   let sortedStaff = [...staff].sort((a, b) => {
          //     return b.staff_id - a.staff_id
          //   })
          //   setStaff(sortedStaff)
          // }
       }}>
        Sort Table
        </Button>
            
        <div>
          <Table>
            <Table.Head>
              <Table.HeadCell>Staff ID</Table.HeadCell>
              <Table.HeadCell>Staff Name</Table.HeadCell>
              <Table.HeadCell>Staff Email</Table.HeadCell>
              <Table.HeadCell>Staff Phone</Table.HeadCell>
              <Table.HeadCell>Department</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {staff.map((staff) => {
                return (
                  <Table.Row key={staff.staff_id}>
                    <Table.Cell>{staff.staff_id}</Table.Cell>
                    <Table.Cell>
                      {staff.fname} {staff.lname}
                    </Table.Cell>
                    <Table.Cell>{staff.email}</Table.Cell>
                    <Table.Cell>{staff.phone}</Table.Cell>
                    <Table.Cell>{staff.dept}</Table.Cell>
                    <Table.Cell>{staff.sys_role}</Table.Cell>
                    <Table.Cell>
                      <Button size="xs">Skill Profile</Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
}
