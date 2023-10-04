"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SearchBar from "@/app/_components/SearchBar";

//flowbite-react components
import R__Navbar from "@/app/_components/R_Navbar";
import R_Sidebar from "@/app/_components/R_Sidebar";
import R_AllRoles from "@/app/_components/R_AllRoles";

import Link from "next/link";

export default function List_Roles() {
  // const router = useRouter()
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
      {/* <div className='container'>
          

        <div className='grid grid-cols-1 place-items-center'>
            
        </div>
      </div> */}

      <R__Navbar />
  
      <SearchBar />
      
    <div className='flex items-stretch h-screen'>
      <div>
        <R_Sidebar />
      </div>
        
      <div className='w-full'>
        <R_AllRoles />
      </div>
      
    </div>
      
      

      {/* <div>
        <h1 className='text-3xl font-bold'>All Roles</h1>
      </div> */}

      {/* <h1>List Roles</h1>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          {roles?.map((role) => {
            return (
              <div key={role.role_listing_id}>
                <Link href={ `/listroles/${role.role_listing_id}` }>{role.role_id}</Link>
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
        </div>
      )} */}
    </div>
  );
}
