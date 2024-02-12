"use client"
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; 

export default function ProfilePage() {

    const router = useRouter();
    const [data, setData] = useState("Null");
    const logout = async () => {
        try {
            await axios.get('api/users/logout');
            toast.success("Logout Success");
            router.push('/login');
        } catch (error:any) {
            console.log(error.message);
            toast.error (error.message)
        }
    }

    const getUser = async () => {
        const res = await axios.get('api/users/me');
        console.log(res.data);
        setData(res.data.data.username)
    }
    return (
        <div className=" flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <hr />
            <p>Profile Page</p>
            <hr />
            <h2>
                {data === "Null" ? "No Data" : <Link href={`/profile/${data}`}>{data}</Link>}
            </h2>

            <button onClick={logout}
                className="bg-blue-500 mt-4 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Logout
            </button>
            <button onClick={getUser}
                className="bg-purple-900 mt-4 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Get User Details
            </button>
        </div>
    )
}
