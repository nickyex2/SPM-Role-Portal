"use client";

// Import required modules and components
import React, {FormEvent, useState, useEffect} from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from 'flowbite-react';

const Login:React.FC = () => {
  const router = useRouter();
  const check_staff_url = "/api/staff/getAll";
  const [email, setEmail] = useState<string>("");
  async function getStaffSkills(staff_id: number): Promise<Array<Number>> {
    const response = await axios.get(`/api/staff/staffSkills/getByStaff/${staff_id}`)
    const staffSkills: Array<Number> = [];
    response.data.data?.staff_skills.forEach((staffSkill: TStaffSkill) => {
      if (staffSkill.ss_status === "active") {
        staffSkills.push(staffSkill.skill_id);
      }
    });
    return staffSkills;
  }
  useEffect(() => {
    if (sessionStorage.getItem("staff_id")) {
      router.push("/listroles");
    }
  }, [router])
  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.get(check_staff_url);
      const staff = res.data.data.staffs;
      console.log(staff);
      for (var i = 0; i < staff.length; i++) {
        if (staff[i].email == email) {
          // Set session storage
          sessionStorage.setItem("staff_id", staff[i].staff_id);
          sessionStorage.setItem("fname", staff[i].fname);
          sessionStorage.setItem("lname", staff[i].lname);
          sessionStorage.setItem("dept", staff[i].dept);
          sessionStorage.setItem("email", staff[i].email);
          sessionStorage.setItem("phone", staff[i].phone);
          sessionStorage.setItem("biz_address", staff[i].biz_address);
          sessionStorage.setItem("sys_role", staff[i].sys_role);
          getStaffSkills(staff[i].staff_id).then((staffSkills) => {
            sessionStorage.setItem("skills", JSON.stringify(staffSkills));
          });
          console.log("Login successful");
          router.push("/listroles");
          return;
        }
      }
      console.log("Login unsuccessful");
      alert("Login unsuccessful");
    }
    catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

        <a href="#" className="flex items-center mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
          <Image
            src="https://flowbite.com/docs/images/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className='mr-3'
          />
          All-In-One
        </a>

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>

            <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSignIn}>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="jack.ng.2020@all-in-one.com.sg"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full text-black dark:text-white hover:bg-primary-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:hover:bg-primary-200 dark:focus:ring-primary-800"
              >
                Sign in
              </Button>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
