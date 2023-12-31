"use client";

import React, { useEffect } from "react";
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { useRouter, usePathname } from "next/navigation";

export default function R_Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [staff, setStaff] = React.useState({
    fname: "",
    lname: "",
    email: "",
    staff_id: "",
    sys_role: "",
  });
  useEffect(() => {
    setStaff({
      fname: sessionStorage.getItem("fname") as string,
      lname: sessionStorage.getItem("lname") as string,
      email: sessionStorage.getItem("email") as string,
      staff_id: sessionStorage.getItem("staff_id") as string,
      sys_role: sessionStorage.getItem("sys_role") as string,
    })
  }, []);
  function logout() {
    sessionStorage.clear();
    router.push("/Login");
  }
  return (
    <Navbar fluid rounded className="sticky top-0 z-50 bg-blue-300 rounded-none">
      <Navbar.Brand href="/listroles">
        {/* <img
          alt="Flowbite React Logo"
          className="mr-3 h-6 sm:h-9"
          src="/favicon.svg"
        /> */}
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          All-In-One
        </span>
      </Navbar.Brand>

      <Navbar.Collapse>
        <Navbar.Link href="/listroles">Jobs</Navbar.Link>
        <Navbar.Link href="/Skills">Skills</Navbar.Link>
        {staff.sys_role === "hr" || staff.sys_role === "manager" ? (
          <Navbar.Link href="/search">Staff</Navbar.Link>
        ) : null}
        <Navbar.Link active href="/profile" className="md:hidden">
          View Profile
        </Navbar.Link>
        <Navbar.Link href="/login" className="md:hidden">Sign Out</Navbar.Link>
      </Navbar.Collapse>

      <div className="flex md:order-2">
        <div className="hidden md:flex order-2">
          {staff.email !== "" ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar alt="User settings" rounded />}
            >
              <Dropdown.Header>
                <span className="block text-sm">
                  {`${staff.fname} ${staff.lname}`}
                </span>
                <span className="block truncate text-sm font-medium">
                  {staff.email}
                </span>
              </Dropdown.Header>
              <Dropdown.Item
                onClick={() => {
                  router.push("/profile");
                }}
              >
                Profile
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={() => {
                  logout();
                }}
              >
                Sign out
              </Dropdown.Item>
            </Dropdown>
          ) : null}
          <ThemeSwitcher />
        </div>
        <Navbar.Toggle />
      </div>
    </Navbar>
  );
}
