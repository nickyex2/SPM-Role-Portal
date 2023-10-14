'use client';
import React from 'react';
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Button, Modal, Table } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { HiOutlineArrowLeft } from 'react-icons/hi';

export default function Role_Applicants( { params } : { params: { role_listing_id: string } }) {
  const router = useRouter();
  const role_listing_id = params.role_listing_id;
  const [openModal, setOpenModal] = useState<string | undefined>();
  const props = { openModal, setOpenModal };
  const [modalStaff, setModalStaff] = useState<TStaff>();
  const [roleApplicants, setRoleApplicants] = useState<Array<TRoleApplicant>>([]);
  const [applicantDetails, setApplicantDetails] = useState<Array<TStaff>>([]); 
  const [loading, setLoading] = useState(true);
  async function getRoleApplicants(role_listing_id: number): Promise<Array<TRoleApplicant>> {
    const response: AxiosResponse<TResponseData> = await axios.get(
      `http://localhost:5005/getRoleApplicationsListing/${role_listing_id}`
    );
    return response.data.data;
  }
  async function getMultipleStaff(staff_ids: Array<number>): Promise<Array<TStaff>> {
    const response: AxiosResponse<TResponseData> = await axios.post(
      `http://localhost:5000/getMultipleStaff`,
      { staff_ids: staff_ids }
    );
    return response.data.data?.staff;
  }
  useEffect(() => {
    setLoading(true);
    getRoleApplicants(Number(role_listing_id)).then((roleApplicants: Array<TRoleApplicant>) => {
      setRoleApplicants(roleApplicants);
      const staff_ids: Array<number> = [];
      roleApplicants.forEach((roleApplicant: TRoleApplicant) => {
        staff_ids.push(roleApplicant.staff_id);
      });
      getMultipleStaff(staff_ids).then((staff: Array<TStaff>) => {
        setApplicantDetails(staff);
      });
      setLoading(false);
    });
  }, [role_listing_id])
  return (
    <div>
      <div className='mx-auto w-3/4 mt-10'>
        <Button className='mb-5' onClick={() => {
          router.push(`/listroles/${role_listing_id}`)
        }}>
          <HiOutlineArrowLeft className="h-6 w-6" />
        </Button>
        <Table>
          <Table.Head>
            <Table.HeadCell>
              <span className="font-bold">Applicant ID</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="font-bold">Name</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="font-bold">Email</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="font-bold">Department</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="font-bold">Status</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="font-bold">Applied Date</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="font-bold">Role Skill %</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="font-bold">More Actions</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {loading ? (
              <Table.Row>
                <Table.Cell colSpan={6}>
                  <span className="font-bold">Loading...</span>
                </Table.Cell>
              </Table.Row>
            ) : (
              roleApplicants.map((roleApplicant: TRoleApplicant) => {
                const applicantDetail: TStaff | undefined = applicantDetails.find((staff: TStaff) => {
                  console.log(staff.staff_id, roleApplicant.staff_id)
                  return staff.staff_id === roleApplicant.staff_id;
                });
                return (
                  <Table.Row key={roleApplicant.role_app_id}>
                    <Table.Cell>
                      <span>{roleApplicant.role_app_id}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span>{applicantDetail?.fname} {applicantDetail?.lname}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span>{applicantDetail?.email}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span>{applicantDetail?.dept}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span>{roleApplicant.role_app_status}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span>{roleApplicant.role_app_ts_create.toLocaleString()}</span>
                    </Table.Cell>
                    <Table.Cell>
                      
                    </Table.Cell>
                    <Table.Cell>
                      <Button size="xs" onClick={() => {
                        setModalStaff(applicantDetail as TStaff);
                        props.setOpenModal('pop-up-profile');
                      }}>View Profile</Button>
                    </Table.Cell>
                  </Table.Row>
                )
              })
            )}
          </Table.Body>
        </Table>
        <Modal show={props.openModal === 'pop-up-profile'} size="md" popup onClose={() => props.setOpenModal(undefined)}>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <h1 className="text-3xl font-bold">Profile</h1>
              <p>{modalStaff?.lname} {modalStaff?.fname}</p>
              <p>{modalStaff?.email}</p>
              <p>{modalStaff?.dept}</p>
              <p>{modalStaff?.phone}</p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => props.setOpenModal(undefined)}>
                  {`Back To All Applicants`}
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  )
}

