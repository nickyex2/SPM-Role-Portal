"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "flowbite-react";

export default function List_Roles() {
  const router = useRouter();
  const [roles, setRoles] = useState<Array<TRoleListing>>();
  const [loading, setLoading] = useState(true);

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
  return (
    <div>
      <h1>List Roles</h1>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          {roles?.map((role) => {
            return (
              <div key={role.role_listing_id}>
                <Link href={`/listroles/${role.role_listing_id}`}>
                  {role.role_id}
                </Link>
                <h2>{role.role_listing_desc}</h2>
                <h3>{role.role_listing_open.toString()}</h3>
                <h4>
                  {new Date(role.role_listing_ts_create).toLocaleString(
                    "en-GB",
                    { timeZone: "Asia/Singapore" }
                  )}
                </h4>
              </div>
            );
          })}
          {sessionStorage.getItem("sys_role") === "hr" ||
          sessionStorage.getItem("sys_role") === "manager" ? (
            <Button
              type="button"
              onClick={() => {
                router.push("/listroles/add");
              }}
            >
              Add New Role Listing
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
