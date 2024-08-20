import {
    GithubIcon,
    GoogleIcon
} from "@/components/icons"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"



export function SignInWithGoogle({signUpText}: {signUpText: string}) {
    const router = useRouter();

    const signInWithGoogle = async () => {
       const result = await signIn('google', { callbackUrl: '/app/home' });
        if (result?.error) {
            toast.error('Sign in with Google failed');
            router.push('/signup');
        } else {
            toast.success('Sign in with Google successful');
        }
    }

    return (
        <Button variant={'outline'} onClick={(event) => {
            event.preventDefault();
            signInWithGoogle();
        }}
            className="w-full rounded-lg dark:bg-secondary dark:hover:bg-secondary-foreground dark:text-secondary-foreground dark:hover:text-secondary flex gap-2">
            <GoogleIcon size="24"></GoogleIcon>
            <span>{signUpText}</span>
        </Button>
    )
}

export function SignInWithGithub() {
    return (
        <Button onClick={async (event) => {
            event.preventDefault();
        }} className="w-full dark:bg-secondary rounded-lg dark:hover:bg-secondary-foreground dark:text-secondary-foreground dark:hover:text-secondary">
            <GithubIcon className="size-5"></GithubIcon>
        </Button>
    )
}
