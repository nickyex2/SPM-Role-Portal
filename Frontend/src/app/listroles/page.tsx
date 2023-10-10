"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "@/app/_components/SearchBar";
import R__Navbar from "@/app/_components/R_Navbar";
import Link from "next/link";
import { Button, Table } from "flowbite-react";
import { error } from "console";

export default function List_Roles() {
  const router = useRouter();
  const [roles, setRoles] = useState<Array<TRoleListing>>([]);
  const [roleDetails, setRoleDetails] = useState<Array<TRoleDetails>>([]);
  const [loading, setLoading] = useState(true);
  const [sysRole, setSysRole] = useState<string>("");
  const getAllRolesURL = "http://localhost:5002/getAllRoleListings";
  const getRoleDetailsURL = "http://localhost:5003/getRoles";

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

  useEffect(() => {
    setLoading(true);
    if (sessionStorage.getItem("staff_id") === null || sessionStorage.getItem("staff_id") === undefined) {
      router.push("/login");
    }
    getAllRoles()
      .then((data) => {
        // Fetch details for all roles concurrently using Promise.all
        setRoles(data);
        let role_ids: Array<Number> = [];
        data.forEach((role) => {
          role_ids.push(role.role_id);
        });
        getRoleDetails(role_ids)
          .then((data) => {
            setRoleDetails(data);
            console.log(data);
          })
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        setLoading(false);
      });
  }, []);
  
  useEffect(() => {
    setSysRole(sessionStorage.getItem("sys_role") as string);
  }, []);

  return (
    loading ? ( <h1>Loading...</h1> ) : (
    <div>
      <R__Navbar />
      <SearchBar />
      <div className="flex items-stretch h-screen flex-col">
          {sysRole === "hr" || sysRole === "manager" ? (
            <Button
              type="button"
              onClick={() => {
                router.push("/listroles/add");
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
                  {/* <div className='grid justify-items-end '>
                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-right mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                      <span className="sr-only">Icon description</span>
                    </button>
                  </div> */}
                </div>                    
                
            </Link>
            );
          })}
        </div>
      </div>
    </div>
    )
  );
}
