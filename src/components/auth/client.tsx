import { Button } from "../ui/button"
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
    <Button
      variant={'ghost'}
      className="w-full h-8 rounded-md px-1.5 py-2 flex justify-start font-normal"
      onClick={() => signOut()}
    >
     <span className="p-0">Sign out</span>
    </Button>
  )
}
