"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge, Button, Modal, Toast, Tabs, Card } from "flowbite-react";
import { useRouter } from "next/navigation";
import { HiOutlineCheckCircle, HiCheck, HiBriefcase, HiClipboardList, HiTag } from 'react-icons/hi'
import EditListing from "@/app/_components/EditListing";
import Loading from "@/app/_components/Loading";

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
  function matchColour() {
    if (Math.round((skillMatchCounter / roleSkillsDetails.length) * 100) < 40) {
      return(
        <p className='text-6xl text-center md:text-9xl font-bold text-red-600'>
                  {
                    Math.round((skillMatchCounter / roleSkillsDetails.length) * 100) + "%"
                  }
                  <p className='text-4xl font-bold text-center md:text-5xl font-bold text-left text-gray-900 dark:text-white'>Match</p>
                </p>
      )
    } else if (Math.round((skillMatchCounter / roleSkillsDetails.length) * 100) > 40 && Math.round((skillMatchCounter / roleSkillsDetails.length) * 100) < 70) {
      return (
        <p className='text-6xl text-center md:text-9xl font-bold text-orange-400'>
                  {
                    Math.round((skillMatchCounter / roleSkillsDetails.length) * 100) + "%"
                  }
                  <p className='text-4xl font-bold text-center md:text-5xl font-bold text-left text-gray-900 dark:text-white'>Match</p>
                </p>
      )
    } else {
      return (
        <p className='text-6xl text-center md:text-9xl font-bold text-green-600'>
                  {
                    Math.round((skillMatchCounter / roleSkillsDetails.length) * 100) + "%"
                  }
                  <p className='text-4xl font-bold text-center md:text-5xl font-bold text-left text-gray-900 dark:text-white'>Match</p>
                </p>
      )
    }
  }
   
  return (
    loading ? ( <Loading />) : (
    <div>
      <Tabs.Group
      aria-label="Tabs with icons"
      style="underline"
      className="mx-auto mt-2">
        <Tabs.Item
        active
        icon={HiBriefcase}
        title="Role Details"
        className='border-0'>
          <div className='w-5/6 md:w-2/3 mx-auto mb-4'>
            <Card>
              <div className='flex flex-col items-start gap-2'>
                <h1 className='text-3xl font-semibold text-gray-900 dark:text-white'>Skills Match</h1>
                <div className='object-contain'>
                    <div className='md:flex flex-row items-center gap-8'>
                      <span className="m-8">
                        {matchColour()}               
                        <br></br>
                        {/* <p className='hidden md:text-5xl font-bold text-left'>Match</p> */}
                      </span>
                      <span>

                        <div className='flex flex-row items-start gap-8'>
                          <div className='flex flex-col items-start'>
                            <p className='font-medium text-xl mb-2'>Matched Skills</p>
                              {roleSkillsDetails.map((roleSkill, idx) => {
                                if (currUserSkills.includes(roleSkill.skill_id)) {
                                  return (
                                    <Badge color="success" key={idx} className="mr-4 my-1">
                                      {roleSkill.skill_name}
                                    </Badge>
                                  )
                                }
                              })}
                          </div>
                          <div className='flex flex-col items-start'>
                            <p className='font-medium text-xl mb-2'>Missing Skills</p>
                                {roleSkillsDetails.map((roleSkill, idx) => {
                                  if (!currUserSkills.includes(roleSkill.skill_id)) {
                                    return (
                                      <Badge color="failure" key={idx} className="mr-4 my-1">
                                        {roleSkill.skill_name}
                                      </Badge>
                                    )
                                  }
                                })}
                            </div>
                        </div>
                      </span>
                    </div>
                </div>
              </div>
            </Card>
            
          </div>

          <div className='w-5/6 md:w-2/3 mx-auto mb-4'>
            <Card>
                <div className='flex flex-col gap-4'>
                  <div className='flex flex-row'>
                    <h1 className='text-3xl font-semibold text-gray-900 dark:text-white'>Role Details</h1>
        
                        <div 
                          onClick={() => {
                            props.setOpenModal('pop-up-edit');
                          }}
                          className='ml-auto cursor-pointer'>
                            <svg className="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                            <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z"/>
                            <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z"/>
                          </svg>
                        </div>
                        
                  </div>
                  
                  
                  <div className='flex flex-row gap-8'>
                    <div className='grow'>
                      <p className='font-semibold'>Role Name</p>
                      <p>{ roleDetails?.role_name || '' }</p>
                    </div>
                    <div className='grow'>
                      <p className='font-semibold'>Role ID</p>
                      <p>{ role?.role_id || '' }</p>
                    </div>

                  </div>

                  <div>
                    <div className='flex flex-row gap-8'>
                      <div className='grow'>
                        <p className='font-semibold'>Role Description</p>
                        <p>{ role?.role_listing_desc || '' }</p>
                      </div>

                    </div>
                  </div>

                  <div>
                    <div className='flex flex-row gap-8'>
                      <div className='grow'>
                        <p className='font-semibold'>Date Listed</p>
                        <p>{ role?.role_listing_open || '' }</p>
                      </div>

                    </div>
                  </div>

                  <div>
                    <div className='flex flex-col gap-2'>
                        <p className='font-semibold'>Skills Required</p>
                        <div className='flex flex-col items-start md:flex md:flex-row'>
                            {roleSkillsDetails.map((roleSkill, idx) => {
                            
                              return (
                                
                                  <Badge color="success" key={idx} className='mb-2 mr-1'>
                                  {roleSkill.skill_name}
                                  </Badge>
                                
                                
                              )
                            
                          })}
                        </div>
                    </div>
                  </div>

                  <div className='flex flex-row items-center mt-2'>
                    <div className='w-2/3 mx-auto'>
                      {appliedRole && appliedRole.role_app_status !== "withdrawn" ? (
                        
                        <Button 
                        className='mx-auto w-5/6'
                        onClick={() => {
                          withdrawRole(appliedRole);
                        }}>Withdraw</Button>
                        
                        
                      ) : 
                        
                        <Button 
                        className='mx-auto w-5/6'
                        onClick={() => {
                          applyRole(role?.role_listing_id as number, parseInt(sessionStorage.getItem("staff_id") as string));
                        }}>Apply</Button>
                      

                      }
                      </div>
                    
                  </div>

                </div>
              </Card>
              <div className='flex flex-col items-center my-10'>
              {sessionStorage.getItem("sys_role") === "hr" || parseInt(sessionStorage.getItem("staff_id") as string) === role?.role_listing_source ? (
                        <div className='flex flex-row gap-2'>
                          <Button onClick={() => {
                            router.push(`/listroles/${params.role_listing_id}/applicants`)
                          }}>
                            View Applicants
                          </Button>
                        </div>
                        
                      ): null}
              </div>
            
          </div>
      </Tabs.Item>
      <Tabs.Item
      icon={HiClipboardList}
      title="Change Log"
      >
        <div className='w-5/6 md:w-2/3 mx-auto mb-4'>
          <Card>
            <div className='flex flex-col items-start gap-2'>
              <h1 className='text-3xl font-semibold mb-4 text-gray-900 dark:text-white'>Change Log</h1>
              {
                roleListingChanges.map((change, idx) => {
                  return (
                    <div key={idx}>
                      <span className='font-semibold'>Change #{change.change_no}&ensp;•&ensp;</span> 
                      <span className='font-semibold'>{change.role_listing_updater}</span>
                      <span className='font-light'> changed </span>
                      <span className='font-semibold'>{change.changed_field}</span>
                      <span className='font-light'> on Role </span>
                      <span className='font-semibold'>#{change.role_listing_id}</span>
                      <span className='font-light'> from </span>
                      <span className='font-semibold'>{change.old_value}</span>
                      <span className='font-light'> to </span>
                      <span className='font-semibold'>{change.new_value} &ensp;•</span>
                      <span className='font-light'>&ensp;{change.log_time}</span> 
                    </div>
                  )
                })
              }
              <div >
                      <span className='font-semibold'>Change #1&ensp;•&ensp;</span> 
                      <span className='font-semibold'>chiok</span>
                      <span className='font-light'> changed </span>
                      <span className='font-semibold'>something</span>
                      <span className='font-light'> on Role </span>
                      <span className='font-semibold'>#2</span>
                      <span className='font-light'> from </span>
                      <span className='font-semibold'>9</span>
                      <span className='font-light'> to </span>
                      <span className='font-semibold'>10 &ensp;•</span>
                      <span className='font-light'>&ensp;1 week ago</span> 
                    </div>

              
            </div>
          </Card>
        </div>

      </Tabs.Item>
    </Tabs.Group>
      
      
      {/* here
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
      end */}
      
      {/* {sessionStorage.getItem("sys_role") === "hr" || parseInt(sessionStorage.getItem("staff_id") as string) === role?.role_listing_source ? (
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
      <Button type="button" onClick={()=>{router.push('/listroles')}}>Return to All Listings</Button> */}
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