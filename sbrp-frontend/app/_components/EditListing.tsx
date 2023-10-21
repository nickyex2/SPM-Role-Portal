"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Datepicker, Modal} from "flowbite-react";
import { useRouter } from "next/navigation";

export default function Role_Listing_Edit({
  roleListing,
  role_listing_id,
  props,
}: {
  roleListing: TRoleListing;
  role_listing_id: number;
  props: {
    openModal: string | undefined;
    setOpenModal: React.Dispatch<React.SetStateAction<string | undefined>>;
    showToast: boolean;
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
    setRole: React.Dispatch<React.SetStateAction<TRoleListing|undefined>>;
    setRoleListingChanges: React.Dispatch<React.SetStateAction<TRoleListingChanges[]>>;
  };
}) {
  const router = useRouter();
  const [role, setRole] = useState<TRoleListing>(roleListing);
  const [editingStaffID, setEditingStaffID] = useState("");
  useEffect(() => {
    setEditingStaffID(sessionStorage.getItem("staff_id") as string);
  }, []);
  async function getChanges(role_listing_id: number): Promise<Array<TRoleListingChanges>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `/api/role/roleListing/getChanges/${role_listing_id}`
    );
    return response.data.data?.role_listing_changes;
  }
  async function submitEditedRoleListing() {
    // need to add in updater id and updater timestamp into state
    console.log(role);
    setRole({
      ...role,
      role_listing_updater: parseInt(editingStaffID),
    });
    try {
      const response: AxiosResponse<TResponseData> = await axios.put(
        `/api/role/roleListing/update/${role_listing_id}`,
        role
      );
      if (response.data.code === 200) {
        const changes: Array<TRoleListingChanges> = await getChanges(role_listing_id);
        props.setOpenModal(undefined);
        props.setRole(role);
        props.setRoleListingChanges(changes);
        props.setShowToast(true);
      };
    }
    catch (error) {
      console.log(error);
    };
  };

  return (
    <Modal
      show={props.openModal === "pop-up-edit"}
      size="3xl"
      popup
      onClose={() => props.setOpenModal(undefined)}
    >
      <Modal.Header className="ps-5 py-5">Edit Role Listing</Modal.Header>
      <Modal.Body>
        <form className="mx-auto mt-5">
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="number"
              name="role_listing_id"
              id="floating_role_listing_id"
              className="block py-2.5 px-0 w-full text-sm text-gray- bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={role?.role_listing_id}
              readOnly
              disabled
              required
            />
            <label
              htmlFor="floating_role_listing_id"
              className="peer-focus:font-medium absolute text-sm text-gray- dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Role Listing ID
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <textarea
              name="role_listing_desc"
              id="floating_role_listing_desc"
              className="block py-2.5 px-0 w-full text-sm text-gray- bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
              className="peer-focus:font-medium absolute text-sm text-gray- dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Role Listing Description
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="number"
              name="role_listing_source"
              id="floating_role_listing_source"
              className="block py-2.5 px-0 w-full text-sm text-gray- bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={role?.role_listing_source}
              readOnly
              disabled
              required
            />
            <label
              htmlFor="floating_role_listing_source"
              className="peer-focus:font-medium absolute text-sm text-gray- dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Role Listing Source Manager ID
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <label
              htmlFor="role_listing_status"
              className="block mb-2 text-sm font-medium text-gray- dark:text-white"
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
          <div className="grid md:grid-cols-2 md:gap-6 z-0">
            <div className="relative z-50 w-full mb-6 group">
              <Datepicker
                onSelectedDateChanged={(date) => {
                  console.log(date);
                  setRole({
                    ...role,
                    role_listing_open: `${date.getFullYear()}-${
                      date.getMonth() + 1
                    }-${date.getDate()}`,
                  } as TRoleListing);
                }}
                value={new Date(role?.role_listing_open).toDateString()}
              />
            </div>
            <div className="relative z-50 w-full mb-6 group">
              <Datepicker
                onSelectedDateChanged={(date) => {
                  setRole({
                    ...role,
                    role_listing_close: `${date.getFullYear()}-${
                      date.getMonth() + 1
                    }-${date.getDate()}`,
                  } as TRoleListing);
                }}
                value={new Date(role?.role_listing_close).toDateString()}
              />
            </div>
          </div>
          <div className="flex gap-5">
            <Button onClick={() => {
              props.setOpenModal(undefined);
            }}>
              Close
            </Button>
            <Button onClick={() => {
              submitEditedRoleListing();
            }}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
