"use client";
import React, { useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { Datepicker, Modal } from "flowbite-react";
import { Button, Checkbox, Label, TextInput, Textarea } from "flowbite-react";

export default function Add_New_Role_Listing({
  props,
}: {
  props: {
    openModal: string | undefined;
    setOpenModal: React.Dispatch<React.SetStateAction<string | undefined>>;
    showToast: boolean;
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  };
}) {
  const todayDate = new Date();
  const [roleListing, setRoleListing] = useState<TRoleListing>({
    role_listing_id: 0,
    role_id: 0,
    role_listing_desc: "",
    role_listing_source: 0,
    role_listing_open: `${todayDate.getFullYear()}-${
      todayDate.getMonth() + 1
    }-${todayDate.getDate()}`,
    role_listing_close: `${todayDate.getFullYear()}-${
      todayDate.getMonth() + 1
    }-${todayDate.getDate()}`,
    role_listing_status: "active",
    role_listing_creator: 0,
    role_listing_ts_create: 0,
    role_listing_updater: 0,
    role_listing_ts_update: 0,
  });
  useEffect(() => {
    setRoleListing({
      ...roleListing,
      role_listing_creator: parseInt(sessionStorage.getItem("staff_id") as string),
      role_listing_updater: parseInt(sessionStorage.getItem("staff_id") as string)
    })
  }, [roleListing]);
  async function handleAddRoleListing() {
    console.log(roleListing);
    const response: AxiosResponse<TResponseData> = await axios.post(
      "http://localhost:5002/createRoleListing",
      roleListing
    );
    if (response.status === 201) {
      props.setOpenModal(undefined);
      props.setShowToast(true);
    }
  }
  return (
    <Modal
      show={props.openModal === "pop-up-add"}
      size="3xl"
      popup
      onClose={() => props.setOpenModal(undefined)}
    >
      <Modal.Header className="ps-5 py-5">Add Role Listing</Modal.Header>
      <Modal.Body>
        <form className="flex flex-col gap-4 mx-auto">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="role_listing_id" value="Role Listing ID" />
            </div>
            <TextInput
              id="role_listing_id"
              required
              type="text"
              onChange={(e) => {
                setRoleListing({
                  ...roleListing,
                  role_listing_id: parseInt(e.target.value),
                });
              }}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="role_id" value="Role ID" />
            </div>
            <TextInput
              id="rold_id"
              required
              type="text"
              onChange={(e) => {
                setRoleListing({
                  ...roleListing,
                  role_id: parseInt(e.target.value),
                });
              }}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="role_description"
                value="Role Listing Description"
              />
            </div>
            <Textarea
              id="rold_id"
              required
              rows={5}
              onChange={(e) => {
                setRoleListing({
                  ...roleListing,
                  role_listing_desc: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="role_listing_source"
                value="Role Listing Source Manager ID"
              />
            </div>
            <TextInput
              id="role_listing_source"
              required
              type="text"
              onChange={(e) => {
                setRoleListing({
                  ...roleListing,
                  role_listing_source: parseInt(e.target.value),
                });
              }}
            />
          </div>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative w-full mb-3 group">
              <div className="mb-2 block">
                <Label
                  htmlFor="role_listing_open"
                  value="Role Listing Open Date"
                />
                <Datepicker
                  id="role_listing_open"
                  required
                  onSelectedDateChanged={(open_date) => {
                    setRoleListing({
                      ...roleListing,
                      role_listing_open: `${open_date.getFullYear()}-${
                        open_date.getMonth() + 1
                      }-${open_date.getDate()}`,
                    });
                  }}
                />
              </div>
            </div>
            <div className="relative w-full mb-3 group">
              <div className="mb-2 block">
                <Label
                  htmlFor="role_listing_close"
                  value="Role Listing Close Date"
                />
                <Datepicker
                  id="role_listing_close"
                  required
                  onSelectedDateChanged={(close_date) => {
                    setRoleListing({
                      ...roleListing,
                      role_listing_close: `${close_date.getFullYear()}-${
                        close_date.getMonth() + 1
                      }-${close_date.getDate()}`,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Checkbox
              id="remember"
              onChange={(e) => {
                if (e.target.checked)
                  setRoleListing({
                    ...roleListing,
                    role_listing_status: "inactive",
                  });
                else
                  setRoleListing({
                    ...roleListing,
                    role_listing_status: "active",
                  });
              }}
            />
            <Label htmlFor="remember">Set as Inactive</Label>
          </div>
          <div className="grid md:grid-cols-2 md:gap-6">
            <Button
              type="button"
              onClick={() => {
                props.setOpenModal(undefined);
              }}
            >
              Back
            </Button>
            <Button type="button" onClick={handleAddRoleListing}>
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
