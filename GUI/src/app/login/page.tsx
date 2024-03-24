"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  // const session = useSession();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    // Here you can implement your login logic
    const email = e.target[0].value;
    const password = e.target[1].value;

  

    // const res = await signIn("credentials", {
    //   redirect: false,
    //   email,
    //   password,
    // });

    // if (res?.error) {
    //   setError("Invalid email or password");
    //   if (res?.url) router.replace("/dashboard");
    // } else {
    //   setError("");
    // }

    let res : any = await fetch(`http://localhost:3005/loginuser?email=${email}&pass=${password}`);

    console.log("sign in result ",res);
    if (res.ok){
      
      router.push("/dashboard");

    }
    
  };

  return (
    // sessionStatus !== "authenticated" && (
      <div className="min-h-screen flex items-center justify-center bg-gray-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div>
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        
        <form className="mt-8" onSubmit={handleLogin}>
          <div className="rounded-md shadow-lg">
            <div>
              <input 
                type="email" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" 
                placeholder="Email address" />
            </div>
            <div className="-mt-px">
              <input 
                type="password" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" 
                placeholder="Password" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm leading-5">
              <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                Don&apos;t have an account?
              </a>
            </div>
          </div>
          <div className="mt-6">
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 10a7 7 0 1 1 14 0 7 7 0 0 1-14 0zm2 0a5 5 0 1 0 10 0 5 5 0 0 0-10 0zm11-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-5 8.586V14a1 1 0 0 1-2 0v-1.414A2 2 0 0 1 7.414 11H6a1 1 0 0 1 0-2h1.414A2 2 0 0 1 10 8.586V10a1 1 0 0 1 2 0v1.414A2 2 0 0 1 14.586 13H16a1 1 0 0 1 0 2h-1.414A2 2 0 0 1 11 13.414z" clipRule="evenodd" />
                </svg>
              </span>
              Sign in
            </button>
            <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
          </div>
        </form>
        </div>
        </div>
      </div>
    )
    
  // );
};

export default LoginPage;
