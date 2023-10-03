"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Datepicker } from "flowbite-react";
import { Button, Checkbox, Label, TextInput, Textarea } from 'flowbite-react';
import { useRouter } from "next/navigation";

export default function Add_New_Role_Listing() {
  const [roleListing, setRoleListing] = useState<TRoleListing>({
    role_listing_id: 0,
    role_id: 0,
    role_listing_desc: "",
    role_listing_source: 0,
    role_listing_open: "",
    role_listing_close: "",
    role_listing_status: "",
    role_listing_creator: 0,
    role_listing_ts_create: 0,
    role_listing_ts_updater: 0,
    role_listing_ts_update: 0,
  });
  async function handleAddRoleListing() {
    // need to add in updater id and updater timestamp into state then send to db
    console.log(roleListing);
  }
  return (
    <div>
      <form className="flex max-w-lg flex-col gap-4 mx-auto mt-20">
      <div>
        <div className="mb-2 block">
          <Label
            htmlFor="role_listing_id"
            value="Role Listing ID"
          />
        </div>
        <TextInput
          id="role_listing_id"
          required
          type='text'
          onChange={(e) =>{
            setRoleListing({...roleListing, role_listing_id: parseInt(e.target.value)})
          }
          }
        />
        </div>
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="role_id"
              value="Role ID"
            />
          </div>
          <TextInput
            id="rold_id"
            required
            type="text"
            onChange={(e) =>{
              setRoleListing({...roleListing, role_id: parseInt(e.target.value)})
            }
            }
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
            onChange={(e) =>{
              setRoleListing({...roleListing, role_listing_desc: e.target.value})
            }
            }
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
            onChange={(e) =>{
              setRoleListing({...roleListing, role_listing_source: parseInt(e.target.value)})
            }
            }
          />
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative w-full mb-6 group">
            <div className="mb-2 block">
              <Label
                htmlFor="role_listing_open"
                value="Role Listing Open Date"
              />
              <Datepicker
                id="role_listing_open"
                required
                onSelectedDateChanged={(open_date) =>{
                  setRoleListing({...roleListing, role_listing_open: `${open_date.getFullYear()}-${open_date.getMonth() + 1}-${open_date.getDate()}`})
                }
                }
              />
            </div>
          </div>
          <div className="relative w-full mb-6 group">
            <div className="mb-2 block">
              <Label
                htmlFor="role_listing_close"
                value="Role Listing Close Date"
              />
              <Datepicker
                id="role_listing_close"
                required
                onSelectedDateChanged={(close_date) =>{
                  setRoleListing({...roleListing, role_listing_close: `${close_date.getFullYear()}-${close_date.getMonth() + 1}-${close_date.getDate()}`})
                }
                }
              />
            </div>
          </div>
        </div>
        <Button type="button" onClick={handleAddRoleListing}>
          Submit
        </Button>
      </form>
    </div>
  );
}
