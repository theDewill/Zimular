import { Metadata } from "next"
import Image from "next/image"
import React from 'react'
import { cn } from "@/lib/utils";
import Navigation from '@/components/main-nav';
import { buttonVariants } from "@/components/ui/button"
import Link from 'next/link';
import { UserSignupForm } from '@/components/user-signup-form';

const Signup = () => {
  return (
    <>
      <Navigation />
      <div className="container relative hidden h-[575px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-slate-700" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <h1 className="text-2xl font-semibold">Get Started</h1>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email, username, password below to create your account
              </p>
            </div>
            <UserSignupForm />
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup
