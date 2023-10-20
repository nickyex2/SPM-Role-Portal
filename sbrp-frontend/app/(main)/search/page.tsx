"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner, TextInput, Table, Dropdown, Button } from "flowbite-react";
import { TableCell } from "flowbite-react/lib/esm/components/Table/TableCell";

export default function SearchStaff() {
  const router = useRouter();
  const [skills, setSkills] = useState<Array<TSkillDetails>>([]);
  const [staff, setStaff] = useState<Array<TStaff>>([]);
  const [initialStaff, setInitialStaff] = useState<Array<TStaff>>([]);
  const [staffSkills, setStaffSkills] = useState<TSpecificStaffSkills>({});
  const [searchBy, setSearchBy] = useState<string>("Skills"); // ["Skills", "Name"]
  const [loading, setLoading] = useState<boolean>(true);
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
      `/api/staffSkills/getMulti`,
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
  function handleSearch(search: string) {
    // on search, filter skills first, then filter staffskills to get staff_ids then filter staff
    // search === "", reset to initialStaff and initialSkills
    if (search === "") {
      setStaff(initialStaff);
      return;
    }
    if (searchBy === "Skills") {
      // filter skills
      let filteredSkills = skills.filter((skill) => {
        return skill.skill_name.toLowerCase().includes(search.toLowerCase());
      });
      // filter staffskills to get staff_ids
      let staff_ids: Array<number> = [];
      filteredSkills.forEach((skill) => {
        // if skill.skill_id is in staffSkills, add staff_id to staff_ids
        Object.entries(staffSkills).forEach(([staff_id, staffSkills]) => {
          if (
            staffSkills.includes(skill.skill_id) &&
            !staff_ids.includes(Number(staff_id))
          ) {
            staff_ids.push(Number(staff_id));
          }
        });
      });
      // filter staff
      let filteredStaff = staff.filter((staff) => {
        return staff_ids.includes(staff.staff_id);
      });
      setStaff(filteredStaff);
    } else if (searchBy === "Name") {
      let filteredStaff = staff.filter((staff) => {
        return (
          staff.fname.toLowerCase().includes(search.toLowerCase()) ||
          staff.lname.toLowerCase().includes(search.toLowerCase())
        );
      });
      setStaff(filteredStaff);
    }
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
    setLoading(false);
  }, []);
  return loading ? (
    <div className="text-center">
      <Spinner aria-label="Extra large spinner example" size="xl" />
      <h1>Loading...</h1>
    </div>
  ) : (
    <>
      <div className="flex">
        <Dropdown label={searchBy} dismissOnClick={true}>
          <Dropdown.Item onClick={() => setSearchBy("Name")}>
            Name
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSearchBy("Skills")}>
            Skills
          </Dropdown.Item>
        </Dropdown>
        <TextInput
          placeholder="Search Staff"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        ></TextInput>
      </div>
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
    </>
  );
}
