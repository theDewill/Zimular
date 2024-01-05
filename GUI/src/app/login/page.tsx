"use client";
import Link from "next/link";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Navbar from "../home/Navbar";





export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
       
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);


    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            toast.success("Login success");
            router.push("/profile");
        } catch (error:any) {
            console.log("Login failed", error.message);
            toast.error(error.message);
        } finally{
        setLoading(false);
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else{
            setButtonDisabled(true);
        }
    }, [user]);

    return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
        <Navbar/>
        <div className="w-96 p-6 shadow-lg bg-white rounded-md">
            <h1 className="text-3xl block text-center font-semibold">{loading ? "Processing" : "Login"}</h1>
            <hr />
            
            <label htmlFor="email" className="mt-3 block text-base mb-2">Email</label>
            <input 
            className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600 rounded-md"
                id="email"
                type="text"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
                placeholder="email"
                />
            <label htmlFor="password" className="mt-3 block text-base mb-2">Password</label>
            <input 
            className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600 rounded-md"
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})}
                placeholder="password"
                />
                <div className="mt-5">
                    <button
                    onClick={onLogin}
                    className="border-2 border-blue-700 bg-indigo-700 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-indigo-700 font-semibold">Login here</button></div>
                    <div className="mt-3 text-sm text-cyan-950 font-semibold">
                    <Link href="/signup" >Don't have an account? create one</Link></div>
                
        </div>
    </div>
    )

}