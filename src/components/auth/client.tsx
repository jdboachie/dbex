import { cn } from "@/lib/utils";
import { buttonVariants, Button } from "../ui/button"
import { signOut, signIn } from "next-auth/react";


export function SignIn () {
  return (
  <Button
    variant={'ghost'}
    className="p-0 px-1.5 flex justify-start font-normal"
    onClick={() => signIn()}
  >
    Sign In
  </Button>
  )
}

export function SignOut () {
  return (
    <div
      className={cn(
        buttonVariants({ variant: 'ghost'}),
        "w-full rounded-md px-0 py-0 flex justify-start font-normal"
      )}
      onClick={() => signOut()}
    >
     <span className="p-0">Sign out</span>
    </div>
  )
}
