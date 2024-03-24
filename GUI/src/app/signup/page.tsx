"use client"

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignupPage = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }
  const handleSignup = async (e: any) => {
    e.preventDefault();
    // Here you can implement your signup logic
    
    const email = e.target[0].value;
    const password = e.target[1].value;
    console.log(email, password);

    if(!isValidEmail(email)){
      setError("Invalid email");  
      return;
    }
  
    if(!password || password.length < 6){
      setError("Password is invalid");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3005/createuser?email=${email}&password=${password}`);
      if(res.status == 400){
        setError("This email is already in use");
      }
      if(res.status == 200){
        setError("");
        router.push("/login");
      }
    } catch (error) {
      setError("Something went wrong");
      console.log(error);
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div>
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">Create an ZIMULAR account</h2>
        </div>
        <form className="mt-8" onSubmit={handleSignup}>
          <div className="rounded-md shadow-sm">
            <div>
              <input 
                name="email" 
                type="text"
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
          <div className="mt-6">
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 10a7 7 0 1 1 14 0 7 7 0 0 1-14 0zm2 0a5 5 0 1 0 10 0 5 5 0 0 0-10 0zm11-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-5 8.586V14a1 1 0 0 1-2 0v-1.414A2 2 0 0 1 7.414 11H6a1 1 0 0 1 0-2h1.414A2 2 0 0 1 10 8.586V10a1 1 0 0 1 2 0v1.414A2 2 0 0 1 14.586 13H16a1 1 0 0 1 0 2h-1.414A2 2 0 0 1 11 13.414z" clipRule="evenodd" />
                </svg>
              </span>
              Sign up
            </button>
          </div>
          <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
        </form>
        <div className='text-center text-grey-500 mt-4'>
          - OR -
        </div>
        <Link href='/login'>
          Login with an existing account
        </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
