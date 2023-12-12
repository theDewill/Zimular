"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { axios } from "axios";


export default function LoginPage() {
    const [user, setUser] = React.useState({
        email: "",
        password: ""
    });

    const onLogin = async () => {};
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Login Page</h1>
            <hr />
            <label htmlFor="email">Email</label>
            <input 
                className="border border-gray-400 p-2 rounded-md"
                id="email"
                type="text" 
                placeholder="Email"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
            />
            <label htmlFor="password">Password</label>
            <input 
                className="border border-gray-400 p-2 rounded-md"
                id="password"
                type="password" 
                placeholder="Password"
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})}
            />
            <button
                onClick={onLogin}
                className="border border-gray-400 p-2 rounded-md"
            >Login</button>
            <Link href="/signup"> Don&apos;t have an account? </Link>
        </div>
    )
}