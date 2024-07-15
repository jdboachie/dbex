"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'

import {
    MailIcon as Mail,
    LockIcon as Lock
} from "@/components/icons"

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

import { SignInWithGithub, SignInWithGoogle } from "@/components/auth/SignInWithGoogleGithub"
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
    const [csrfToken, setCsrfToken] = useState<string | null>(null)

    useEffect(() => {
        async function fetchCsrfToken() {
            const token = await getCsrfToken();
            console.log('Fetched CSRF token:', token);
            setCsrfToken(token);
        }
    
        fetchCsrfToken();
    }, []);
    

    const form = useForm<z.infer<typeof signInFormSchema>>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const router = useRouter()
    const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
        if (!csrfToken) {
            console.error("CSRF token is not set. Form submission is blocked.");
            return;
        }
    
        console.log("Entered onSubmit");
        const { email, password } = values;
        console.log("CSRF token before submission:", csrfToken);
        const result = await signUserIn({ email, password, csrfToken });
        if (result.success) {
            router.push('/app/home');
          } else {
            console.error(result.error);
          }
    };
    

    return (
        <div className="flex flex-row justify-center items-center min-h-screen font-sans">
            <div className="form-wrapper w-96 rounded-lg border p-3 shadow-2xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" method="post">
                        <div className="flex flex-col justify-center items-center gap-2">
                            <h1 className="text-3xl font-bold">Sign In</h1>
                            <div className="text-sm">
                                <span className="text-muted-foreground">Don't have an account? </span>
                                <Link href="/signUp" className="underline">Sign Up</Link>
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
                                            <Mail className="absolute flex flex-row top-1/2 -translate-y-1/2 mx-1.5 stroke-slate-400 size-4 text-muted-foreground"></Mail>
                                            <Input type="email" placeholder="Enter email" {...field} className="placeholder-shown:px-6 px-6 text-muted-foreground" />
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
                                            <Lock className="absolute flex flex-row top-1/2 -translate-y-1/2 mx-1.5 stroke-slate-400 size-4 text-muted-foreground"></Lock>
                                            <Input type="password" placeholder="Enter password" {...field} className="placeholder-shown:px-6 px-6 text-muted-foreground" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <input name="csrfToken" type="hidden" defaultValue={csrfToken || ""} />
                        <Button type="submit" className="w-full dark:bg-secondary dark:hover:bg-secondary-foreground dark:text-secondary-foreground dark:hover:text-secondary">Submit</Button>
                        <div className="flex flex-row justify-center items-center">
                            <span className="text-sm capitalize">Or Continue With</span>
                        </div>
                        <div className="signInWithGoogleAndGitHub flex gap-5">
                            <SignInWithGoogle />
                            <SignInWithGithub />
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
