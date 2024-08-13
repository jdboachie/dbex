"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { signIn } from "next-auth/react"

import {
    MailIcon as Mail,
    LockIcon as Lock,
    DbexIcon,
    EyeIcon,
    EyeOffIcon
} from "@/components/icons"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"

import { SignInWithGithub, SignInWithGoogle } from "@/components/auth/SignUpWIthGoogleAndGithub"
// import { signUserIn } from "@/lib/actions"
import { getCsrfToken } from "next-auth/react"



const signInFormSchema = z.object({
    email: z.string().email({
        message: "Invalid email address"
    }),
    password: z.string().min(8).refine((data) => data.match(/[a-z]/) && data.match(/[A-Z]/) && data.match(/[0-9]/) && data.match((/^(?=.*[\W_]).*$/)), {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number.",
        path: ["password"],
    })
})

type signInFormSchema = z.infer<typeof signInFormSchema>

export default function SignInPage() {

    const form = useForm<z.infer<typeof signInFormSchema>>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
        console.log("Entered onSubmit");
        const { email, password } = values;
        toast.promise(
            signIn('credentials', { email, password, callbackUrl: '/app/home' }),
            {
                loading: 'Signing in...',
                success: 'Signed in successfully',
                error: 'Failed to sign in'
            });
    };

    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const togglePasswordVisibility: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
        event.preventDefault();
        setIsPasswordShown(!isPasswordShown);
    }


    return (
        <div className="w-full rounded-md dark:bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
            <div className="flex flex-row justify-center items-center min-h-screen font-sans">
                <div className="form-wrapper w-96 rounded-lg border p-5 shadow-2xl bg-background relative z-50">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" method="post">
                            <div className="flex flex-col justify-center items-center gap-3">
                                <DbexIcon></DbexIcon>
                                <h1 className="text-xl font-bold">Welcome Back</h1>
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Don&apos;t have an account? </span>
                                    <Link href="/signup" className="underline">Sign Up</Link>
                                </div>
                            </div>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Email</FormLabel>
                                        <FormControl>
                                            <div className="input-icon flex flex-row relative">
                                                <Mail className="absolute flex flex-row top-1/2 -translate-y-1/2 mx-2 stroke-slate-400 size-4 text-muted-foreground"></Mail>
                                                <Input type="email" placeholder="Enter mail" {...field} className="placeholder-shown:px-7 px-7 text-muted-foreground rounded-lg" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Password</FormLabel>
                                        <FormControl>
                                            <div className="input-icon flex flex-row relative">
                                                <Lock className="absolute flex flex-row top-1/2 -translate-y-1/2 mx-2 stroke-slate-400 size-4 text-muted-foreground"></Lock>
                                                <Input id="password-input" type={isPasswordShown ? 'text' : 'password'} placeholder="Enter password"{...field} className="password-input placeholder-shown:px-7 px-7 text-muted-foreground" />
                                                <a
                                                    onClick={togglePasswordVisibility}
                                                    href="#"
                                                    className="absolute z-50 flex flex-row top-1/2 -translate-y-1/2 right-0 mx-2"
                                                >
                                                    <EyeOffIcon className={`size-4 text-muted-foreground ${!isPasswordShown ? 'hidden' : 'block'}`} />
                                                    <EyeIcon className={`size-4 text-muted-foreground ${isPasswordShown ? 'hidden' : 'block'}`} />
                                                </a>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full dark:bg-secondary dark:hover:bg-secondary-foreground dark:text-secondary-foreground dark:hover:text-secondary rounded-lg">Submit</Button>
                            <div className="flex flex-row justify-center items-center">
                                <div className="line w-1/2 h-[1.5px] rounded-full bg-foreground-50"></div>
                                <span className="text-sm capitalize px-3 text-foreground-300"> OR </span>
                                <div className="line w-1/2 h-[1.5px] rounded-full bg-foreground-50"></div>
                            </div>
                            <div className="signInWithGoogleAndGitHub flex gap-3">
                                <SignInWithGoogle />
                                {/* <SignInWithGithub /> */}
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
            <BackgroundBeams />
        </div>

    )
}

