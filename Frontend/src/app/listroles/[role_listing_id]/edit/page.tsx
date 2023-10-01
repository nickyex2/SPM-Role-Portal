"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Datepicker } from "flowbite-react";
import { useRouter } from "next/navigation";

export default function Role_Listing_Edit({
  params,
}: {
  params: { role_listing_id: string };
}) {
  const router = useRouter();
  const [role, setRole] = useState<TRoleListing>({
    role_listing_id: 0,
    role_id: 0,
    role_listing_desc: "",
    role_listing_source: "",
    role_listing_open: new Date(),
    role_listing_close: new Date(),
    role_listing_status: "",
    role_listing_creator: 0,
    role_listing_ts_create: 0,
    role_listing_ts_updater: 0,
    role_listing_ts_update: 0,
  });
  const [loading, setLoading] = useState(true);
  async function submitEditedRoleListing() {
    // need to add in updater id and updater timestamp into state
    console.log(role);
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
    setLoading(false);
  }, [params.role_listing_id]);

  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <form className="w-6/12 mx-auto mt-28">
      <div className="relative z-0 w-full mb-6 group">
        <input
          type="number"
          name="role_listing_id"
          id="floating_role_listing_id"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={role?.role_listing_id}
          disabled
          required
        />
        <label
          htmlFor="floating_role_listing_id"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Role Listing ID
        </label>
      </div>
      <div className="relative z-0 w-full mb-6 group">
        <textarea
          name="role_listing_desc"
          id="floating_role_listing_desc"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={role?.role_listing_desc}
          onChange={(e) => {
            setRole({
              ...role,
              role_listing_desc: e.target.value,
            } as TRoleListing);
          }}
          required
        />
        <label
          htmlFor="floating_role_listing_desc"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Role Listing Description
        </label>
      </div>
      <div className="relative z-0 w-full mb-6 group">
        <input
          type="number"
          name="role_listing_source"
          id="floating_role_listing_source"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={role?.role_listing_source}
          disabled
          required
        />
        <label
          htmlFor="floating_role_listing_source"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Role Listing Source Manager ID
        </label>
      </div>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="role_listing_open"
            id="floating_role_listing_open"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={role?.role_listing_open.toString()}
            onChange={(e) => {
              setRole({
                ...role,
                role_listing_open: new Date(e.target.value),
              } as TRoleListing); // not sure how to change this yet
            }}
            required
          />
          <label
            htmlFor="floating_role_listing_open"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Role Listing Open
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="role_listing_close"
            id="floating_role_listing_close"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={role?.role_listing_close.toString()}
            required
          />
          <label
            htmlFor="floating_role_listing_close"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Role Listing Close
          </label>
        </div>
      </div>
      <div className="relative z-0 w-full mb-6 group">
        <label
          htmlFor="role_listing_status"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Role Listing Status
        </label>
        <select
          id="role_listing_status"
          value={role?.role_listing_status}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e) => {
            setRole({
              ...role,
              role_listing_status: e.target.value,
            } as TRoleListing);
          }}
        >
          <option value={`active`}>active</option>
          <option value={`inactive`}>inactive</option>
        </select>
      </div>
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => {
          router.back();
        }}
      >
        Back
      </button>
      <button
        type="button"
        className="text-white ms-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={submitEditedRoleListing}
      >
        Save Changes
      </button>
    </form>
  );
}
