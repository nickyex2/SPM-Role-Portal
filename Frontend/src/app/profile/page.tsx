"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import R__Navbar from "@/app/_components/R_Navbar";
import { Button, Table } from "flowbite-react";

export default function Profile() {
  // get manager, skills, and roles
  const [reportingOfficer, setReportingOfficer] = useState<TReportingOfficer>();
  const [staffRoles, setStaffRoles] = useState<Array<TStaffRole>>([]);
  const [staffSkills, setStaffSkills] = useState<Array<TStaffSkill>>([]);
  const [loading, setLoading] = useState(true);
  async function getReportingOfficer(): Promise<TReportingOfficer> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      "http://localhost:5001/getReportingOfficer"
    );
    return response.data.data?.reporting_officer;
  }
  return (
    <div>
      <R__Navbar />
    </div>
  )
}
