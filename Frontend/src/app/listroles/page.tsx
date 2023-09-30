'use client'
import React from 'react'
import {axios, AxiosResponse} from 'axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'


export default function List_Roles() {
    const router = useRouter()
    const [roles, setRoles] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        axios.get('http://localhost:5002/getAllRoleListings')
            .then((res: AxiosResponse<any>) => {
                setRoles(res.data)
                setLoading(false)
                console.log(res.data)
            })

            .catch((err: any | unknown) => {
                console.log(err)
            })
    }, [])
    return (
        <div>
            <h1>List Roles</h1>
        </div>
    )
}