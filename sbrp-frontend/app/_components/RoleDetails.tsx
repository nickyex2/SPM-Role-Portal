"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Modal,
  Label,
  TextInput,
  Toast,
  Dropdown,
  Spinner,
  Tabs,
  Card,
} from "flowbite-react";
import dateFormat from "dateformat";
import { HiBriefcase, HiClipboardList } from "react-icons/hi";

type RoleDetailsProps = {
  selectedRole: TRoleListing;
  roleDetails: TRoleDetails;
  sysRole: string;
  roleSkills: number[];
  currUserSkills: number[];
  roleDetailsToastProps: {
    showApplySuccessToast: boolean;
    setShowApplySuccessToast: React.Dispatch<React.SetStateAction<boolean>>;
    showApplyErrorToast: boolean;
    setShowApplyErrorToast: React.Dispatch<React.SetStateAction<boolean>>;
    showWithdrawSuccessToast: boolean;
    setShowWithdrawSuccessToast: React.Dispatch<React.SetStateAction<boolean>>;
    showWithdrawErrorToast: boolean;
    setShowWithdrawErrorToast: React.Dispatch<React.SetStateAction<boolean>>;
    showEditSuccessToast: boolean;
    setShowEditSuccessToast: React.Dispatch<React.SetStateAction<boolean>>;
    showEditErrorToast: boolean;
    setShowEditErrorToast: React.Dispatch<React.SetStateAction<boolean>>;
  };
  setUpdateRoleListing: (roleListing: TRoleListing) => void;
};

export default function RoleDetails({
  selectedRole,
  roleDetails,
  sysRole,
  roleSkills,
  currUserSkills,
  roleDetailsToastProps,
  setUpdateRoleListing,
}: RoleDetailsProps) {
  //, roleDetails
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState<string | undefined>(undefined);
  const [appliedRole, setAppliedRole] = useState<TRoleApplicant | undefined>(
    undefined
  );
  const [roleSkillsDetails, setRoleSkillsDetails] = useState<
    Array<TSkillDetails>
  >([]);
  const [roleListingChanges, setRoleListingChanges] = useState<
    Array<TRoleListingChanges>
  >([]);
  const [roleListingSource, setRoleListingSource] = useState<
    TStaff | undefined
  >(undefined);

  const props = { openModal, setOpenModal }; //setRole, setRoleListingChanges

  const today = new Date();
  const roleListingPostDate = new Date(selectedRole.role_listing_ts_create);
  const timeDifference = today.getTime() - roleListingPostDate.getTime();
  const daysSincePosted = Math.floor(timeDifference / (1000 * 3600 * 24));

  const [editedRoleData, setEditedRoleData] = useState({
    role_listing_desc: selectedRole.role_listing_desc,
    role_listing_open: selectedRole.role_listing_open,
    role_listing_close: selectedRole.role_listing_close,
    role_listing_status: selectedRole.role_listing_status,
    role_listing_updater: selectedRole.role_listing_source,
  });

  async function getSkillDetails(
    roleSkills: Array<Number>
  ): Promise<Array<TSkillDetails>> {
    let sendData = {
      skill_ids: roleSkills,
    };
    const response: AxiosResponse<TResponseData> = await axios.post(
      `/api/skills/getMulti`,
      sendData
    );
    return response.data.data;
  }

  async function getRoleListingChanges(): Promise<Array<TRoleListingChanges>> {
    try {
      const response: AxiosResponse<TResponseData> = await axios.get(
        `/api/role/roleListing/getChanges/${selectedRole.role_listing_id}`
      );
      return response.data.data?.role_listing_changes;
    } catch (error: any) {
      if (error.response.code === 404) {
        console.log("No role listing changes found");
      }
      return [];
    }
  }

  async function getAppliedRole(): Promise<TRoleApplicant | undefined> {
      const response: AxiosResponse<TResponseData> = await axios.get(
        `/api/role/roleapp/getByRoleLStaff/${
          selectedRole.role_listing_id
        }/${sessionStorage.getItem("staff_id")}`
      );
      console.log("response.data.data: ", response.data.data);
      return response.data.data;
  }

  async function getRoleListingSource(): Promise<TStaff | undefined> {
      const response: AxiosResponse<TResponseData> = await axios.get(
        `/api/staff/getOne/${selectedRole.role_listing_source}`
      );
      console.log("response.data.data: ", response.data.data);
      return response.data.data;
  }

  async function applyRole(role_listing_id: number, staff_id: number) {
    const sendApplication = {
      role_listing_id: role_listing_id,
      staff_id: staff_id,
      role_app_status: "applied",
    };
    const response: AxiosResponse<TResponseData> = await axios.post(
      `/api/role/roleapp/create`,
      sendApplication
    );
    props.setOpenModal(undefined);
    if (response.status === 201) {
      roleDetailsToastProps.setShowApplySuccessToast(true);
      setTimeout(() => roleDetailsToastProps.setShowApplySuccessToast(false), 10000);
      setAppliedRole(response.data.data);
    } else {
      roleDetailsToastProps.setShowApplyErrorToast(true);
      setTimeout(() => roleDetailsToastProps.setShowApplyErrorToast(false), 10000);
    }
  }

  async function withdrawRole(roleApplication: TRoleApplicant) {
    const response: AxiosResponse<TResponseData> = await axios.put(
      `/api/role/roleapp/update/${roleApplication.role_app_id}`,
      {
        ...roleApplication,
        role_app_status: "withdrawn",
      }
    );
    props.setOpenModal(undefined);
    if (response.status === 200) {
      roleDetailsToastProps.setShowWithdrawSuccessToast(true);
      setTimeout(() => roleDetailsToastProps.setShowWithdrawSuccessToast(false), 10000);
      setAppliedRole(response.data.data);
    } else {
      roleDetailsToastProps.setShowWithdrawErrorToast(true);
      setTimeout(() => roleDetailsToastProps.setShowWithdrawErrorToast(false), 10000);
    }
  }

  async function editListing(editedRoleData: any) {
    const response: AxiosResponse<TResponseData> = await axios.put(
      `/api/role/roleListing/update/${selectedRole.role_listing_id}`,
      editedRoleData
    );
    props.setOpenModal(undefined);
    if (response.status === 200) {
      setUpdateRoleListing(response.data.data);
      roleDetailsToastProps.setShowEditSuccessToast(true);
      setTimeout(() => roleDetailsToastProps.setShowEditSuccessToast(false), 10000);
    } else {
      roleDetailsToastProps.setShowEditErrorToast(true);
      setTimeout(() => roleDetailsToastProps.setShowEditErrorToast(false), 10000);
    }
  }

  useEffect(() => {
    setLoading(true);
  }, [selectedRole.role_listing_id]);
  if (selectedRole && loading && roleSkills) {
    getSkillDetails(roleSkills).then((data) => {
      setRoleSkillsDetails(data);
      var counter = 0;
      data.map((skill) => {
        if (currUserSkills.includes(skill.skill_id)) {
          counter += 1;
        }
      });
    });
    getRoleListingChanges()
      .then((data) => {
        // sort by log_time in descending order
        data.sort((a, b) => {
          return (
            new Date(b.log_time).getTime() - new Date(a.log_time).getTime()
          );
        });
        setRoleListingChanges(data);
        // console.log("roleListingChanges", data);
      })
      .catch((error) => {
        console.log(error);
        setRoleListingChanges([]);
      });
    //something wrong here
    getAppliedRole()
      .then((data) => {
        if (data) {
          setAppliedRole(data);
        }
      })
      .catch((error) => {
        setAppliedRole(undefined);
      });
    getRoleListingSource().then((data) => {
      if (data) {
        setRoleListingSource(data);
      }
    })
    .catch((error) => {
      setRoleListingSource(undefined);
    });
    setLoading(false);
  }

  return loading ? (
    <div className="text-center">
      <Spinner aria-label="Extra large spinner example" size="xl" />
      <h1>Loading...</h1>
    </div>
  ) : (
    <div className="w-4/5 h-[60vh] overflow-y-scroll bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700">
      <Tabs.Group style="underline" className="mx-auto mt-2">
        <Tabs.Item active icon={HiBriefcase} title="Role Details">
          <div className="max-w h-[60vh] p-6 bg-white dark:bg-gray-800 mx-auto grid grid-cols-4 gap-2">
            {/* Title */}
            <div className="col-span-2">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {roleDetails?.role_name}
              </h5>
            </div>
            {/* Withdraw/Apply Button */}
            <div className="col-span-2">
              <div className="flex justify-end gap-2">
                {sysRole === "hr" ||
                (sysRole === "manager" &&
                  parseInt(sessionStorage.getItem("staff_id") as string) ===
                    selectedRole.role_listing_source) ? (
                  <Button
                    onClick={() => {
                      router.push(
                        `/listroles/${selectedRole.role_listing_id}/applicants`
                      );
                    }}
                    size="xs"
                  >
                    View Applicants
                  </Button>
                ) : null}
                { parseInt(sessionStorage.getItem("staff_id") as string) !== selectedRole.role_listing_source ?
                (appliedRole ? (
                  appliedRole.role_app_status !== "withdrawn" ? (
                    <div>
                      <Button
                        onClick={() => {
                          props.setOpenModal("pop-up-withdraw");
                        }}
                      >
                        Withdraw
                      </Button>
                      <Modal
                        show={props.openModal === "pop-up-withdraw"}
                        size="md"
                        popup
                        onClose={() => props.setOpenModal(undefined)}
                      >
                        <Modal.Header />
                        <Modal.Body>
                          <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                              Withdraw Application?
                            </h3>
                            <h6>Your application will be withdrawn.</h6>
                            <div className="flex gap-5 justify-end">
                              <Button
                                className="bg-gray-300"
                                onClick={() => props.setOpenModal(undefined)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={() => withdrawRole(appliedRole)}>
                                Confirm
                              </Button>
                            </div>
                          </div>
                        </Modal.Body>
                      </Modal>
                    </div>
                  ) : (
                    <div>
                      <Button disabled>Withdrawn</Button>
                    </div>
                  )
                ) : (
                  <div>
                    <Button
                      onClick={() => {
                        props.setOpenModal("pop-up-apply");
                      }}
                    >
                      Apply
                    </Button>
                    <Modal
                      show={props.openModal === "pop-up-apply"}
                      size="md"
                      popup
                      onClose={() => props.setOpenModal(undefined)}
                    >
                      <Modal.Header />
                      <Modal.Body>
                        <div className="space-y-6">
                          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            Confirm Application?
                          </h3>
                          <h6>
                            Your details will be submitted to the hiring team.
                          </h6>
                          <div className="flex gap-5 justify-end">
                            <Button
                              className="bg-gray-300"
                              onClick={() => props.setOpenModal(undefined)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() =>
                                applyRole(
                                  selectedRole?.role_listing_id as number,
                                  parseInt(
                                    sessionStorage.getItem("staff_id") as string
                                  )
                                )
                              }
                            >
                              Confirm
                            </Button>
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>
                )) : null}
                {/* Edit Button and Modal */}
                {sysRole === "hr" ||
                (sysRole === "manager" &&
                  parseInt(sessionStorage.getItem("staff_id") as string) ===
                    selectedRole.role_listing_source) ? (
                  <div>
                    <Button
                      onClick={() => {
                        props.setOpenModal("pop-up-edit");
                      }}
                    >
                      Edit
                    </Button>
                    <Modal
                      show={props.openModal === "pop-up-edit"}
                      size="md"
                      popup
                      onClose={() => props.setOpenModal(undefined)}
                    >
                      <Modal.Header />
                      <Modal.Body>
                        <div className="space-y-4">
                          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            Edit Role Listing
                          </h3>

                          {/* Role Title */}
                          <div className="flex flex-col">
                            <Label className="text-gray-700 dark:text-gray-200">
                              Role Title
                            </Label>
                            <TextInput
                              className="w-full"
                              placeholder="Role Title"
                              value={roleDetails?.role_name}
                              disabled
                            />
                          </div>
                          {/* Role Desc */}
                          <div className="flex flex-col">
                            <Label className="text-gray-700 dark:text-gray-200">
                              Role Description
                            </Label>
                            <textarea
                              id="description"
                              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                              rows={4}
                              placeholder="Description of role"
                              value={editedRoleData.role_listing_desc}
                              onChange={(e) =>
                                setEditedRoleData({
                                  ...editedRoleData,
                                  role_listing_desc: e.target.value,
                                })
                              }
                            />
                          </div>
                          {/* Role Open */}
                          <div className="flex flex-col">
                            <div className="mb-2 block">
                              <Label htmlFor="open_date" value="Opening Date" />
                            </div>
                            <input
                              onChange={(e) => {
                                const selectedDate = new Date(e.target.value);
                                setEditedRoleData({
                                  ...editedRoleData,
                                  role_listing_open: selectedDate
                                    .toISOString()
                                    .slice(0, 10),
                                });
                              }}
                              type="date"
                              id="open_date"
                              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                              required
                              value={editedRoleData.role_listing_open}
                            />
                          </div>
                          {/* Role Close */}
                          <div className="flex flex-col">
                            <div className="mb-2 block">
                              <Label
                                htmlFor="close_date"
                                value="Closing Date"
                              />
                            </div>
                            <input
                              onChange={(e) => {
                                const selectedDate = new Date(e.target.value);
                                setEditedRoleData({
                                  ...editedRoleData,
                                  role_listing_close: selectedDate
                                    .toISOString()
                                    .slice(0, 10),
                                });
                              }}
                              type="date"
                              id="close_date"
                              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                              required
                              value={editedRoleData.role_listing_close}
                            />
                          </div>
                          {/* Role Status as a Dropdown for active or inactive, with the default value to be selectedRole.role_listing_status */}
                          <div className="flex flex-col">
                            <Label className="text-gray-700 dark:text-gray-200">
                              Role Status
                            </Label>
                            <Dropdown
                              // capitalise the first letter in selectedRole.role_listing_status for the label prop
                              label={
                                editedRoleData.role_listing_status
                                  .charAt(0)
                                  .toUpperCase() +
                                editedRoleData.role_listing_status.slice(1)
                              }
                              className="max-h-40"
                              placeholder="Role Status"
                              value={editedRoleData.role_listing_status}
                            >
                              <Dropdown.Item
                                value="active"
                                onClick={() =>
                                  setEditedRoleData({
                                    ...editedRoleData,
                                    role_listing_status: "active",
                                  })
                                }
                              >
                                Active
                              </Dropdown.Item>
                              <Dropdown.Item
                                value="inactive"
                                onClick={() =>
                                  setEditedRoleData({
                                    ...editedRoleData,
                                    role_listing_status: "inactive",
                                  })
                                }
                              >
                                Inactive
                              </Dropdown.Item>
                            </Dropdown>
                          </div>
                          <div className="flex justify-end">
                            <Button onClick={() => editListing(editedRoleData)}>
                              Edit Listing
                            </Button>
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="col-span-4">
              <div className="flex items-center">
                <p className="font-normal text-sm text-gray-400 dark:text-white">
                  {daysSincePosted === 0
                    ? "Posted Today"
                    : `Posted ${daysSincePosted} days ago`}
                </p>
              </div>
            </div>
            {/* Department, How many days posted ago */}
            <div className="col-span-1">
              <div className="flex items-center">
                <p className="font-normal text-sm text-gray-700 dark:text-white">
                  {/* Convert this from all capital to first letter capital with the remaining lower */}
                  Department: <b>{roleListingSource?.dept}</b>
                </p>
              </div>
            </div>

            {/* Closing Date */}
            <div className="col-span-4">
              <div className="flex items-center">
                <p className="font-normal text-sm text-gray-700 dark:text-white">
                  Application Deadline:{" "}
                  {dateFormat(selectedRole.role_listing_close, "dd mmmm yyyy")}
                </p>
              </div>
            </div>

            {/* Hiring Manager (email) */}
            <div className="col-span-4">
              <div className="flex items-center">
                <p className="font-normal text-sm text-gray-700 dark:text-white">
                  Hiring Manager:{" "}
                  {roleListingSource?.fname
                    ?.toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
                  <span className="text-blue-500">
                    ({roleListingSource?.email})
                  </span>
                </p>
              </div>
            </div>

            {/* Skill Match */}
            <div className="col-span-1">
              <p className="font-normal text-sm text-gray-700 dark:text-white">
                Skill Match:
                <br />
                <b>
                  {(roleSkills?.filter((skill) =>
                    currUserSkills.includes(skill)
                  ).length /
                    roleSkills?.length) *
                    100 || 0}{" "}
                  %
                </b>
              </p>
            </div>

            <div className="col-span-3">
              <p className="font-normal text-sm text-gray-700 dark:text-white">
                {roleSkillsDetails.map((skill) => {
                  if (currUserSkills.includes(skill.skill_id)) {
                    return (
                      <span
                        key={skill.skill_name}
                        className="inline-block bg-green-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2"
                      >
                        {skill.skill_name}
                      </span>
                    );
                  } else {
                    return (
                      <span
                        key={skill.skill_name}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2"
                      >
                        {skill.skill_name}
                      </span>
                    );
                  }
                })}
              </p>
            </div>

            {/* Role Description */}
            <div className="col-span-4">
              <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Role Description
              </h5>
            </div>
            <div className="col-span-4">
              <p className="font-normal text-sm text-gray-700 dark:text-white">
                {selectedRole.role_listing_desc}
              </p>
            </div>
          </div>
        </Tabs.Item>
        <Tabs.Item
          icon={HiClipboardList}
          title="Change Log"
          disabled={
            sysRole === "hr" ||
            (sysRole === "manager" &&
              parseInt(sessionStorage.getItem("staff_id") as string) ===
                selectedRole.role_listing_source)
              ? false
              : true
          }
        >
          <div className="max-w h-[60vh] p-6 bg-white shadow dark:bg-gray-800">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
                Change Log
              </h1>
              {roleListingChanges.length !== 0 ? (
                roleListingChanges.map((change, idx) => {
                  return (
                    <div key={idx} className="mb-4">
                      <span className="font-semibold">
                        {dateFormat((new Date(change.log_time).getTime() + 8 * 60 * 60 * 1000) , "dd-mm-yyyy hh:mm:ss TT")}
                        &ensp;•&ensp;
                      </span>
                      Staff ID {" "}
                      <span className="font-semibold">
                        {change.role_listing_updater}
                      </span>
                      <span className="font-light"> changed </span>
                      <span className="font-semibold">
                        {change.changed_field}
                      </span>
                      <br></br>
                      <span className="font-light"> from </span>
                      <span className="font-semibold">{change.old_value}</span>
                      <br></br>
                      <span className="font-light"> to </span>
                      <span className="font-semibold">{change.new_value}</span>
                    </div>
                  );
                })
              ) : (
                <div className="mb-4">
                  <span className="font-semibold">No changes made</span>
                </div>
              )}
            </div>
          </div>
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
}
