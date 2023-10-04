"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";

export default function Role_Listing_Profile( { params } : { params: { role_listing_id: string } }) {
  const router = useRouter();
  const [role, setRole] = useState<TRoleListing>();
  const [roleDetails, setRoleDetails] = useState<TRoleDetails>();
  const [roleSkills, setRoleSkills] = useState<Array<TRoleSkills>>();
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
  useEffect(() => {
    async function getRoleListing(): Promise<TRoleListing> {
      const response: AxiosResponse<TResponseData> = await axios.get(
        `http://localhost:5002/getRoleListing/${params.role_listing_id}`
      );
      return response.data.data;
    }
    setLoading(true);
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
      setRoleSkills(data);
      console.log(data);
    });
    setLoading(false);
  }
  return (
    loading ? ( <h1>Loading...</h1> ) : (
    <div>
      <h1>{role?.role_id}</h1>
      {sessionStorage.getItem("sys_role") === "hr" || parseInt(sessionStorage.getItem("staff_id") as string) === role?.role_listing_source ? (
        <Link type="button" href={ `./${params.role_listing_id}/edit` } className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="30px" height="30px">    <path d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 19 6 L 24 11 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 17 8 L 5.2597656 19.740234 C 5.2597656 19.740234 6.1775313 19.658 6.5195312 20 C 6.8615312 20.342 6.58 22.58 7 23 C 7.42 23.42 9.6438906 23.124359 9.9628906 23.443359 C 10.281891 23.762359 10.259766 24.740234 10.259766 24.740234 L 22 13 L 17 8 z M 4 23 L 3.0566406 25.671875 A 1 1 0 0 0 3 26 A 1 1 0 0 0 4 27 A 1 1 0 0 0 4.328125 26.943359 A 1 1 0 0 0 4.3378906 26.939453 L 4.3632812 26.931641 A 1 1 0 0 0 4.3691406 26.927734 L 7 26 L 5.5 24.5 L 4 23 z"/>
        </svg>
          <span className="sr-only">Icon description</span>
        </Link>
      ): null}
      <h1>{roleDetails?.role_name}</h1>
      <h2>{role?.role_listing_desc}</h2>
      <h3>{role?.role_listing_open.toString()}</h3>
      <h4>
        {role?.role_listing_ts_create && new Date(role?.role_listing_ts_create)?.toLocaleString(
          "en-GB",
          { timeZone: "Asia/Singapore" }
        )}
      </h4>
      <h1> Skills </h1>
      {roleSkills?.map((roleSkill, idx) => {
        return (
          <div key={idx}>
            <h2>{roleSkill.skill_id}</h2>
          </div>
        );
      })}
      <Button type="button" onClick={()=>{router.push('/listroles')}}>Return to All Listings</Button>
    </div>
  )
  );
}