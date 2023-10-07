"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "@/app/_components/SearchBar";
//flowbite-react components
import R__Navbar from "@/app/_components/R_Navbar";
import R_Sidebar from "@/app/_components/R_Sidebar";
import Link from "next/link";
import { Button, Table } from "flowbite-react";

type TRoleDetails = {
  role_id: number,
  role_name: string,
  role_description: string,
  role_status: string,
}

export default function List_Roles() {
  const router = useRouter();
  const [roles, setRoles] = useState<Array<TRoleListing>>();
  const [loading, setLoading] = useState(true);
  const [sysRole, setSysRole] = useState<string>("");
  const getAllRolesURL = "http://localhost:5002/getAllRoleListings";
  const getRoleDetailsURL = "http://localhost:5003/getRole/";

  async function getAllRoles(): Promise<Array<TRoleListing>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      getAllRolesURL
    );
    return response.data.data?.role_listings;
  }

  // async function getRoleName(roleID: number): Promise<String> {
  //   const response: AxiosResponse<TResponseData> = await axios.get(
  //     getRoleDetailsURL + roleID
  //   );
  //   console.log(response.data.data.role_name);
  //   return response.data.data.role_name;
  // }
  
  // Retrieve role details for specified role id
  // async function getRoleDetails(roleID: number): Promise<TRoleDetails> {
  //   const response: AxiosResponse<TResponseData> = await axios.get(
  //     getRoleDetailsURL + roleID
  //   );
  //   return response.data.data;
  // }

  useEffect(() => {
    setLoading(true);
    getAllRoles().then((data) => {
      setRoles(data);
      // console.log(data);
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    setSysRole(sessionStorage.getItem("sys_role") as string);
  }, []);

  return (
    <div>
      <R__Navbar />
      <SearchBar />
      <div className="flex items-stretch h-screen">
        <div className="w-4/6 mx-auto mt-5">
          {sysRole === "hr" ||
          sysRole === "manager" ? (
            <Button
              type="button"
              onClick={() => {
                router.push("/listroles/add");
              }}
              className="mb-5 float-right z-10"
            >
              New Listing
            </Button>
          ) : null}
          {roles?.map((role) => {
            return (
              <Link href={`/listroles/${role.role_listing_id}`} className="max-w p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mx-auto mb-4 grid grid-col-4 gap-2" key={role.role_listing_id}>

                {/* Image */}

                {/* roleList.TITLE */}
                <div className="col-span-1">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{role.role_listing_id}</h5> 
                  <p className="font-normal text-gray-700 dark:text-gray-400">{role.role_listing_open}</p>
                  <p className="font-normal text-gray-700 dark:text-gray-400">{role.role_listing_status}</p>
                </div>

                {/* roleList.role_listing_desc */}
                <div className="col-span-1">
                  <p className="font-normal text-gray-700 dark:text-gray-400">{role.role_listing_close}</p>
                </div>

                {/* role.role_listing_source */}
                <div className="col-span-3">
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    {role.role_listing_desc.length > 200
                    ? role.role_listing_desc.slice(0, 200) + "..."
                    : role.role_listing_desc}
                  </p>
                  <div className='grid justify-items-end '>
                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-right mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                      <span className="sr-only">Icon description</span>
                    </button>
                  </div>
                </div>

                {/* <p className="font-normal text-gray-700 dark:text-gray-400">{role.role_listing_source}</p> */}
                {/* roleList.role_listing_status */}

                {/* roleList.role_listing_open */}

                {/* roleList.role_listing_close */}
                    
                
            </Link>
              // <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={role.role_listing_id}>
              //   <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              //     {role.role_id}
              //   </Table.Cell>
              //   <Table.Cell>{role.role_listing_source}</Table.Cell>
              //   <Table.Cell>{role.role_listing_open}</Table.Cell>
              //   <Table.Cell>{role.role_listing_close}</Table.Cell>
              //   <Table.Cell>
              //     <Link
              //       className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              //       href={`/listroles/${role.role_listing_id}`}
              //     >
              //       View More
              //     </Link>
              //   </Table.Cell>
              // </Table.Row>
            );
          })}
          {/* <Table hoverable className="rounded-md drop-shadow-none z-auto bg-slate-200 dark:bg-[#0d1117]">
            <Table.Body className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  Role Name
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  Hiring Manager
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  Application Opening Date
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  Application Closing Date
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  Action
                </Table.Cell>
              </Table.Row>
              {roles?.map((role) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={role.role_listing_id}>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {role.role_id}
                    </Table.Cell>
                    <Table.Cell>{role.role_listing_source}</Table.Cell>
                    <Table.Cell>{role.role_listing_open}</Table.Cell>
                    <Table.Cell>{role.role_listing_close}</Table.Cell>
                    <Table.Cell>
                      <Link
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        href={`/listroles/${role.role_listing_id}`}
                      >
                        View More
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table> */}
        </div>
      </div>
    </div>
  );
}
