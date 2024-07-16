'use server'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { auth } from "@/auth";
import { cn } from "@/lib/utils";
import { SignOut } from "./server";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton'
import { DotsThree as DotsThreeIcon } from "@phosphor-icons/react/dist/ssr" // TODO: change this to geist icons
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserButtonSkeleton from "@/components/closet/skeletons/UserButtonSkeleton";

export default async function UserButton ({isCollapsed} : {isCollapsed: boolean}) {

  const session  = await auth() // prefer the auth() export

  return (
    session?.user ?
    <div className={cn(
      "w-full grid grid-flow-col p-2",
      isCollapsed && 'px-1 mx-0'
      )}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            size={isCollapsed ? 'icon' : 'default'}
            variant={'ghost'}
            className={cn(
              "flex px-1 w-full h-10",
              isCollapsed ? 'justify-center w-fit mx-auto' : 'justify-between'
            )}
          >
            <div className={cn("flex items-center w-full", isCollapsed && 'w-fit')}>
              <Avatar className="">
                <AvatarImage
                  src={session?.user.image || ''}
                  alt="user avatar"
                />
                <Skeleton>
                  <AvatarFallback></AvatarFallback>
                </Skeleton>
              </Avatar>
              <div className={isCollapsed ? 'hidden': 'flex items-center w-full justify-between mx-2'}>
                <p className="text-sm text-start px-1 text-muted-foreground truncate grow pt-0.5">{session?.user.name}</p>
                <DotsThreeIcon className="size-5" />
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mx-2">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <SignOut />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    :
    <div className="p-2">
      <UserButtonSkeleton isCollapsed={isCollapsed} />
    </div>
  )
}
