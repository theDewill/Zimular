import Navigation from '@/components/main-nav'
import Link from 'next/link'
import React from 'react'
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { UserLoginForm } from '@/components/user-login-form';

const Login = () => {
  return (
    <>
      <Navigation />
      <div className="container relative hidden h-[575px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/signup"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Create Account
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
                Sign In
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email, password below to Sign in.
              </p>
            </div>
            <UserLoginForm />
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
