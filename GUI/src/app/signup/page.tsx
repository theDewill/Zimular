"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";


export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
    });

    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("Signup success", response.data);
            router.push("/login");
            
        } catch (error:any) {
            console.log("Signup failed", error.message);
            
            toast.error(error.message);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{loading ? "Processing" : "Signup"}</h1>
            <hr />
            <label htmlFor="username">Username</label>
            <input 
                className="border border-gray-400 p-2 rounded-md text-black"
                id="username"
                type="text" 
                placeholder="Username"
                value={user.username}
                onChange={(e) => setUser({...user, username: e.target.value})}
            />
            <label htmlFor="email">Email</label>
            <input 
                className="border border-gray-400 p-2 rounded-md text-black"
                id="email"
                type="text" 
                placeholder="Email"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
            />
            <label htmlFor="password">Password</label>
            <input 
                className="border border-gray-400 p-2 rounded-md text-black"
                id="password"
                type="password" 
                placeholder="Password"
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})}
            />
            <button
                onClick={onSignup}
                className="border border-gray-400 p-2 rounded-md"
            >{buttonDisabled ? "No signup" : "Sign Up"}</button>
            <Link href="/login"> Already have an account? </Link>
        </div>
    )
}