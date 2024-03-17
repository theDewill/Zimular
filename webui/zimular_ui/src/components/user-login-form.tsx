"use client"

import React, {useEffect, useState} from "react"
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn,useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils"
import { TokensIcon, GitHubLogoIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { error } from "console";

const formSchema = z.object(
  {
    email: z.string().email(),
    password: z.string().min(6),
  }
)


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserLoginForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const session = useSession();
  //const { data: session, status: sessionStatus } = useSession();
  const [error, setError] = useState("");

  useEffect(()=>{
    if(session?.status == "authenticated"){
      router.replace("/dashboard");
    }
  },[session, router])

  const form = useForm<z.infer<typeof formSchema>>(
    {
      resolver: zodResolver(formSchema),
      defaultValues: {
        email:""
      }
    }
  )

  const handleSubmit = async (values: z.infer<typeof formSchema>)=>{
    const res = await signIn("credentials",{
      redirect: false,
      email: values.email,
      password: values.password,
    })

    if (res?.error){
      setError("Invalid Email or Password");
      if(res?.url) router.replace("/dashboard");
      
      console.log(error)
    }else{
      setError("");
    }
    console.log({values})
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
          <Button className="mt-4 w-full" type="submit">
            Sign In
          </Button>
          <p>{error && error}</p>
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
