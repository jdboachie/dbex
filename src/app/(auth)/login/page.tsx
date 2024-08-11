'use client'
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleIcon, EyeIcon, EyeOffIcon, LockIcon as Lock } from "@/components/icons"
import { useState } from "react"

export default function Login() {
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const togglePasswordVisibility: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
        event.preventDefault();
        setIsPasswordShown(!isPasswordShown);
    }
    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2">
                        <h1 className="text-3xl font-bold dark:text-primary">Welcome Back</h1>
                        <p className="text-balance text-muted-foreground">
                            Sign in to your account
                        </p>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <div className="input-icon flex flex-row relative">
                                <Lock className="absolute flex flex-row top-1/2 -translate-y-1/2 mx-2 stroke-slate-400 size-4 text-muted-foreground"></Lock>
                                <Input id="password-input" type={isPasswordShown ? 'text' : 'password'} placeholder="Enter password" className="password-input placeholder-shown:px-7 px-7 text-muted-foreground" required />
                                <a
                                    onClick={togglePasswordVisibility}
                                    href="#"
                                    className="absolute z-50 flex flex-row top-1/2 -translate-y-1/2 right-0 mx-2"
                                >
                                    <EyeOffIcon className={`size-4 text-muted-foreground ${!isPasswordShown ? 'hidden' : 'block'}`} />
                                    <EyeIcon className={`size-4 text-muted-foreground ${isPasswordShown ? 'hidden' : 'block'}`} />
                                </a>
                            </div>
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                        <div className="flex flex-row justify-center items-center">
                            <div className="line w-1/2 h-[1px] rounded-full bg-secondary"></div>
                            <span className="text-sm capitalize px-3"> OR </span>
                            <div className="line w-1/2 h-[1px] rounded-full bg-secondary"></div>
                        </div>
                        <Button variant="outline" className="w-full">
                            <GoogleIcon size="5" className="size-5 mr-2" />
                            <span>
                                Login with Google
                            </span>
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="#" className="underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-primary-foreground lg:flex items-center justify-center px-10 text-primary leading-relaxed">
                <div className="text-3xl">
                    There are a lot of indie hackers building in public, but it’s rare to see a startup shipping as consistently and transparently as Supabase. Their upcoming March releases look to be 🔥 Def worth a follow! also opened my eyes as to how to value add in open source
                </div>
            </div>
        </div>
    )
}
