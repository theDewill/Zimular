"use client"

import React, { useEffect, useState } from "react";
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

const formSchema = z.object(
  {
    email: z.string().email(),
    username: z.string(),
    password: z.string().min(6),
    passwordConfirm: z.string(),
  }
).refine((data)=> {
  return data.password === data.passwordConfirm
},
{
  message:"Password do not match",
  path:["passwordConfirm"]
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserSignupForm({ className, ...props }: UserAuthFormProps) {

  const router = useRouter();
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof formSchema>>(
    {
      resolver: zodResolver(formSchema),
      defaultValues: {
        email:""
      }
    }
  )

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log({values});
    try {
      const res = await fetch ("/api/signup",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: values.email,
          username: values.username,
          password: values.password,
        })
      })
      if(res.status === 400){
        setError("Email already in use.")
      }
      if (res.status === 200){
        setError("");
        router.push("/login")
      }
    } catch (error) {
      setError("Error, try again");
      console.log(error);
    }
    
  }
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField control={form.control} name="email" render={({field})=>{
            return <FormItem>
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Email"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          }}/>
          <FormField control={form.control} name="username" render={({field})=>{
            return <FormItem>
              <FormLabel className="sr-only">Username</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Username"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          }}/>
          <FormField control={form.control} name="password" render={({field})=>{
            return <FormItem>
              <FormLabel className="sr-only">Password</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          }}/>
          <FormField control={form.control} name="passwordConfirm" render={({field})=>{
            return <FormItem>
              <FormLabel className="sr-only">Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Confirm Password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          }}/>
          <Button className="mt-4 w-full">
            Sign Up
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
    </div>
  )
}
