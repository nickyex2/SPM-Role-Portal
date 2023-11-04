"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, Badge } from "flowbite-react";
import Loading from "../../_components/Loading";
import { HiUser } from "react-icons/hi";

export default function Profile() {
	const router = useRouter();
	// get manager, skills, and roles
	const [reportingOfficer, setReportingOfficer] = useState<TStaff>({
		staff_id: 0,
		fname: "",
		lname: "",
		dept: "",
		email: "",
		phone: "",
		biz_address: "",
		sys_role: "",
	});
	const [staffRoleIDs, setStaffRoleIDs] = useState<Array<TStaffRole>>([]);
	const [staffRoles, setStaffRoles] = useState<Array<TRoleDetails>>([]);
	const [staffSkills, setStaffSkills] = useState<Array<TSkillDetails>>([]);
	const [userProfile, setUserProfile] = useState<TStaff>({
		staff_id: 0,
		fname: "",
		lname: "",
		dept: "",
		email: "",
		phone: "",
		biz_address: "",
		sys_role: "",
	});
	const [loading, setLoading] = useState(true);
	async function getReportingOfficer(staff_id: number): Promise<TStaff> {
		const response: AxiosResponse<TResponseData> = await axios.get(
			`/api/staff/staffRO/getOne/${staff_id}`
		);
		const reportingOfficer: TReportingOfficer = response.data.data;
		const res = await axios.get(
			`/api/staff/getOne/${reportingOfficer.RO_id}`
		);
		return res.data.data;
	}
	async function getStaffRoles(
		staff_id: number
	): Promise<Array<TRoleDetails>> {
		const response: AxiosResponse<TResponseData> = await axios.get(
			`/api/staff/staffRole/getByStaff/${staff_id}`
		);
		setStaffRoleIDs(response.data.data?.staff_roles);
		console.log(response.data.data?.staff_roles);
		const staffRoles: Array<Number> = [];
		response.data.data?.staff_roles.forEach((staffRole: TStaffRole) => {
			staffRoles.push(staffRole.staff_role);
		});
		const res = await axios.post(`/api/role/getMulti`, {
			role_ids: staffRoles,
		});
		return res.data.data;
	}
	async function getStaffSkills(
		staff_id: number
	): Promise<Array<TSkillDetails>> {
		const response: AxiosResponse<TResponseData> = await axios.get(
			`/api/staff/staffSkills/getByStaff/${staff_id}`
		);
		const staffSkills: Array<Number> = [];
		response.data.data?.staff_skills.forEach((staffSkill: TStaffSkill) => {
			staffSkills.push(staffSkill.skill_id);
		});
		const res = await axios.post(`/api/skills/getMulti`, {
			skill_ids: staffSkills,
		});
		return res.data.data;
	}
	useEffect(() => {
		setLoading(true);
		if (
			sessionStorage.getItem("staff_id") === null ||
			sessionStorage.getItem("staff_id") === undefined
		) {
			router.push("/login");
		}
		const staff_id = Number(sessionStorage.getItem("staff_id"));
		setUserProfile({
			staff_id: staff_id,
			fname: sessionStorage.getItem("fname") as string,
			lname: sessionStorage.getItem("lname") as string,
			dept: sessionStorage.getItem("dept") as string,
			email: sessionStorage.getItem("email") as string,
			phone: sessionStorage.getItem("phone") as string,
			sys_role: sessionStorage.getItem("sys_role") as string,
			biz_address: sessionStorage.getItem("biz_address") as string,
		});
		getReportingOfficer(staff_id)
			.then((data) => {
				setReportingOfficer(data);
				console.log(data);
			})
			.catch((error) => {
				console.error("Error fetching reporting officer:", error);
			});
		getStaffRoles(staff_id)
			.then((data) => {
				setStaffRoles(data);
				console.log(data);
			})
			.catch((error) => {
				console.error("Error fetching staff roles:", error);
			});
		getStaffSkills(staff_id)
			.then((data) => {
				setStaffSkills(data);
				console.log(data);
			})
			.catch((error) => {
				console.error("Error fetching staff skills:", error);
			});

		setLoading(false);
	}, [router]);
	return loading ? (
		<Loading />
	) : (
		<div>
			<div className="w-4/6 mx-auto mt-5">
				<Card>
					<div className="flex justify-center px-4 pt-4">
						<div className="flex flex-col items-center pb-10">
							{/* <Image
                    alt="profile"
                    className="mb-3 rounded-full shadow-lg"
                    height={96}
                    src="./././public/images/assets/vercel.svg"
                    width={96}
                  /> */}
							<HiUser
								className="mb-3 rounded-full shadow-lg"
								size={96}
							/>

							<h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
								{userProfile.fname} {userProfile.lname}
							</h5>
							<span className="text-sm text-gray-500 dark:text-gray-400">
								{userProfile.dept}
							</span>

							<div className="mt-8 text-center">
								<p>
									<strong>Email:</strong> {userProfile.email}
								</p>
								<p>
									<strong>Phone:</strong> {userProfile.phone}
								</p>
								<p>
									<strong>Reporting Officer:</strong>{" "}
									{reportingOfficer.fname}{" "}
									{reportingOfficer.lname}
								</p>
								<p>
									<strong>System Role:</strong>{" "}
									{userProfile.sys_role}
								</p>
							</div>

							<div className="mt-4 flex space-x-3 lg:mt-6">
								<a
									className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
									href="#"
								>
									<p>Edit Profile</p>
								</a>
							</div>
						</div>
					</div>
				</Card>
			</div>

			<div className="w-4/6 mx-auto my-5">
				<Card>
					<div className="mb-0 flex items-center justify-between">
						<h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
							Skills
						</h5>
						<a
							className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500"
							href="#"
						>
							<p>Edit</p>
						</a>
					</div>
					<div className="flow-root">
						<ul className="divide-y divide-gray-200 dark:divide-gray-700">
							{staffSkills?.map((skill, idx) => {
								return (
									<li key={idx} className="py-3 sm:py-4">
										<div className="flex items-center space-x-4">
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm font-medium text-gray-900 dark:text-white">
													{skill.skill_name}
												</p>
												<p className="truncate text-sm text-gray-500 dark:text-gray-400">
													Skill ID: {skill.skill_id}
												</p>
											</div>
											<div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
												<Badge color="success">
													{skill.skill_status}
												</Badge>
											</div>
										</div>
									</li>
								);
							})}
						</ul>
					</div>
				</Card>
			</div>
		</div>

		// <div>
		//   <div className="mx-auto w-3/4 mt-5">
		//     <Table className="profile">
		//       <Table.Head>
		//         <Table.HeadCell>First Name</Table.HeadCell>
		//         <Table.HeadCell>Last Name</Table.HeadCell>
		//         <Table.HeadCell>Department</Table.HeadCell>
		//         <Table.HeadCell>Email</Table.HeadCell>
		//         <Table.HeadCell>Phone</Table.HeadCell>
		//         <Table.HeadCell>Reporting Officer</Table.HeadCell>
		//         <Table.HeadCell>System Role</Table.HeadCell>
		//       </Table.Head>
		//       <Table.Body>
		//         <Table.Row>
		//           <Table.Cell>{userProfile.fname}</Table.Cell>
		//           <Table.Cell>{userProfile.lname}</Table.Cell>
		//           <Table.Cell>{userProfile.dept}</Table.Cell>
		//           <Table.Cell>{userProfile.email}</Table.Cell>
		//           <Table.Cell>{userProfile.phone}</Table.Cell>
		//           <Table.Cell>{reportingOfficer.fname} {reportingOfficer.lname}</Table.Cell>
		//           <Table.Cell>{userProfile.sys_role}</Table.Cell>
		//         </Table.Row>
		//       </Table.Body>
		//     </Table>
		//     <Table className="skills my-3">
		//       <Table.Head>
		//         <Table.HeadCell>Skill ID</Table.HeadCell>
		//         <Table.HeadCell>Skill Name</Table.HeadCell>
		//         <Table.HeadCell>Skill Status</Table.HeadCell>
		//       </Table.Head>
		//       <Table.Body>
		//         {staffSkills.map((skill, idx) => (
		//           <Table.Row key={idx}>
		//             <Table.Cell>{skill.skill_id}</Table.Cell>
		//             <Table.Cell>{skill.skill_name}</Table.Cell>
		//             <Table.Cell>{skill.skill_status}</Table.Cell>
		//           </Table.Row>
		//         ))}
		//       </Table.Body>
		//     </Table>
		//     <Table className="roles mt-5">
		//       <Table.Head>
		//         <Table.HeadCell>Role ID</Table.HeadCell>
		//         <Table.HeadCell>Role Name</Table.HeadCell>
		//         <Table.HeadCell>Role Status</Table.HeadCell>
		//         <Table.HeadCell>Role Type</Table.HeadCell>
		//       </Table.Head>
		//       <Table.Body>
		//         {staffRoles.map((role, idx) => (
		//           <Table.Row key={idx}>
		//             <Table.Cell>{role.role_id}</Table.Cell>
		//             <Table.Cell>{role.role_name}</Table.Cell>
		//             <Table.Cell>{role.role_status}</Table.Cell>
		//             <Table.Cell>{staffRoleIDs.find((staffRoleID) => staffRoleID.staff_role === role.role_id)?.role_type}</Table.Cell>
		//           </Table.Row>
		//         ))}
		//       </Table.Body>
		//     </Table>
		//   </div>
		// </div>
	);
}
