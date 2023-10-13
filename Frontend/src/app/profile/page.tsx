"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import R__Navbar from "@/app/_components/R_Navbar";
import { Button, Table } from "flowbite-react";

export default function Profile() {
  const router = useRouter();
  // get manager, skills, and roles
  const [reportingOfficer, setReportingOfficer] = useState<TStaff>({
    staff_id: 0,
    fname: "",
    lname: "",
    dept: "",
    email: "",
    phone: "",
    sys_role: ""
  });
  const [staffRoleIDs, setStaffRoleIDs] = useState<Array<TStaffRole>>([]);
  const [staffRoles, setStaffRoles] = useState<Array<TRoleDetails>>([]);
  const [staffSkills, setStaffSkills] = useState<Array<TSkillDetails>>([]);
  const [userProfile, setUserProfile] = useState<TStaff>({
    staff_id: 0,
    fname: "",
    lname: "",
    dept: "",
    email: "",
    phone: "",
    sys_role: ""
  });
  const [loading, setLoading] = useState(true);
  async function getReportingOfficer(staff_id: number): Promise<TStaff> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `http://localhost:5007/getStaffReportingOfficer/${staff_id}`
    );
    const reportingOfficer: TReportingOfficer = response.data.data
    const res = await axios.get(`http://localhost:5000/getStaff/${reportingOfficer.RO_id}`)
    return res.data.data;
  }
  async function getStaffRoles(staff_id: number): Promise<Array<TRoleDetails>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `http://localhost:5006/getStaffRolesOfSpecificStaff/${staff_id}`
    );
    setStaffRoleIDs(response.data.data?.staff_roles);
    console.log(response.data.data?.staff_roles)
    const staffRoles: Array<Number> = [];
    response.data.data?.staff_roles.forEach((staffRole: TStaffRole) => {
      staffRoles.push(staffRole.staff_role);
    });
    const res = await axios.post(`http://localhost:5003/getRoles`, { role_ids: staffRoles })
    return res.data.data;
  }
  async function getStaffSkills(staff_id: number): Promise<Array<TSkillDetails>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `http://localhost:5004/getStaffSkills/${staff_id}`
    );
    const staffSkills: Array<Number> = [];
    response.data.data?.staff_skills.forEach((staffSkill: TStaffSkill) => {
      staffSkills.push(staffSkill.skill_id);
    });
    const res = await axios.post(`http://localhost:5001/getSkills`, { skill_ids: staffSkills })
    return res.data.data;
  }
  useEffect(() => {
    setLoading(true);
    if (sessionStorage.getItem("staff_id") === null || sessionStorage.getItem("staff_id") === undefined) {
      router.push("/login");
    }
    const staff_id = Number(sessionStorage.getItem("staff_id"));
    setUserProfile({
      staff_id: staff_id,
      fname: sessionStorage.getItem("fname") as string,
      lname: sessionStorage.getItem("lname") as string,
      dept: sessionStorage.getItem("dept") as string,
      email: sessionStorage.getItem("email") as string,
      phone: sessionStorage.getItem("phone") as string,
      sys_role: sessionStorage.getItem("sys_role") as string
    });
    getReportingOfficer(staff_id)
      .then((data) => {
        setReportingOfficer(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching reporting officer:", error);
      });
    getStaffRoles(staff_id)
      .then((data) => {
        setStaffRoles(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching staff roles:", error);
      });
    getStaffSkills(staff_id)
      .then((data) => {
        setStaffSkills(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching staff skills:", error);
      });
  }, [router])
  return (
    <div>
      <R__Navbar />
      <div className="mx-auto w-3/4 mt-5">
        <Table className="profile">
          <Table.Head>
            <Table.HeadCell>First Name</Table.HeadCell>
            <Table.HeadCell>Last Name</Table.HeadCell>
            <Table.HeadCell>Department</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Phone</Table.HeadCell>
            <Table.HeadCell>Reporting Officer</Table.HeadCell>
            <Table.HeadCell>System Role</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>{userProfile.fname}</Table.Cell>
              <Table.Cell>{userProfile.lname}</Table.Cell>
              <Table.Cell>{userProfile.dept}</Table.Cell>
              <Table.Cell>{userProfile.email}</Table.Cell>
              <Table.Cell>{userProfile.phone}</Table.Cell>
              <Table.Cell>{reportingOfficer.fname} {reportingOfficer.lname}</Table.Cell>
              <Table.Cell>{userProfile.sys_role}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Table className="skills my-3">
          <Table.Head>
            <Table.HeadCell>Skill ID</Table.HeadCell>
            <Table.HeadCell>Skill Name</Table.HeadCell>
            <Table.HeadCell>Skill Status</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {staffSkills.map((skill, idx) => (
              <Table.Row key={idx}>
                <Table.Cell>{skill.skill_id}</Table.Cell>
                <Table.Cell>{skill.skill_name}</Table.Cell>
                <Table.Cell>{skill.skill_status}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Table className="roles mt-5">
          <Table.Head>
            <Table.HeadCell>Role ID</Table.HeadCell>
            <Table.HeadCell>Role Name</Table.HeadCell>
            <Table.HeadCell>Role Status</Table.HeadCell>
            <Table.HeadCell>Role Type</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {staffRoles.map((role, idx) => (
              <Table.Row key={idx}>
                <Table.Cell>{role.role_id}</Table.Cell>
                <Table.Cell>{role.role_name}</Table.Cell>
                <Table.Cell>{role.role_status}</Table.Cell>
                <Table.Cell>{staffRoleIDs.find((staffRoleID) => staffRoleID.staff_role === role.role_id)?.role_type}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}
