"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

export default function Role_Listing_Profile( { params } : { params: { role_listing_id: string } }) {
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
    </div>
  )
  );
}