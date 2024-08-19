'use client'
import Image from "next/image"
import Link from "next/link"

import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MailIcon as Mail, EyeIcon, EyeOffIcon, LockIcon as Lock } from "@/components/icons"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { QuoteIcon } from "@radix-ui/react-icons"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { SignInWithGoogle } from "@/components/auth/SignUpWIthGoogleAndGithub"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

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


export default function Login() {

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
        <div className="flex items-center justify-center py-12 border-r">
            <div className="mx-auto grid w-[350px] gap-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" method="post">
                        <div className="grid gap-2">
                            <h1 className="text-3xl font-bold dark:text-primary">Welcome Back</h1>
                            <p className="text-balance text-muted-foreground">
                                Sign in to your account
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
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
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                </div>
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
                            </div>
                            <Button type="submit" className="w-full dark:bg-primary-foreground dark:text-primary dark:hover:bg-secondary">
                                Login
                            </Button>
                            <div className="flex flex-row justify-center items-center">
                                <div className="line w-1/2 h-[1px] rounded-full bg-secondary"></div>
                                <span className="text-sm capitalize px-3"> OR </span>
                                <div className="line w-1/2 h-[1px] rounded-full bg-secondary"></div>
                            </div>
                            <SignInWithGoogle signUpText="Login with Google"></SignInWithGoogle>
                        </div>
                    </form>
                </Form>

                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}
