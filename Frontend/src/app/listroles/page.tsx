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

export default function List_Roles() {
  const router = useRouter();
  const [roles, setRoles] = useState<Array<TRoleListing>>();
  const [loading, setLoading] = useState(true);
  const [sysRole, setSysRole] = useState<string>("");
  async function getAllRoles(): Promise<Array<TRoleListing>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      "http://localhost:5002/getAllRoleListings"
    );
    return response.data.data?.role_listings;
  }
  useEffect(() => {
    setLoading(true);
    getAllRoles().then((data) => {
      setRoles(data);
      console.log(data);
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
        <div>
          <R_Sidebar />
        </div>
        <div className="w-4/6 mx-auto bg-slate-200 dark:bg-[#0d1117] ">
          {sysRole === "hr" ||
          sysRole === "manager" ? (
            <Button
              type="button"
              onClick={() => {
                router.push("/listroles/add");
              }}
              className="float-right mt-5 mb-5"
            >
              New Listing
            </Button>
          ) : null}
          <Table hoverable className="rounded-md drop-shadow-none">
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
                      <a
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        href={`/listroles/${role.role_listing_id}`}
                      >
                        <p>View More</p>
                      </a>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}
