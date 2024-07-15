import {
    GithubIcon,
    GoogleIcon
} from "@/components/icons"

import { Button } from "@/components/ui/button"

export function SignInWithGoogle() {
    return (
        <Button onClick={async (event) => {
            event.preventDefault();
        }}
            className="w-full rounded-lg dark:bg-secondary dark:hover:bg-secondary-foreground dark:text-secondary-foreground dark:hover:text-secondary">
            <GoogleIcon size="24"></GoogleIcon>
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