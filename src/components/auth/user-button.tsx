'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as React from 'react'
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { DotsThree as DotsThreeIcon } from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from '@/components/ui/skeleton'
import UserButtonSkeleton from "@/components/closet/skeletons/UserButtonSkeleton";
import { SignOut } from "./client";

export default function UserButton ({isCollapsed} : {isCollapsed: boolean}) {

  const { data } = useSession()

  return (
    data?.user ?
    <div className={cn(
      "w-full grid grid-flow-col p-2",
      isCollapsed && 'px-1 mx-0'
      )}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            size={isCollapsed ? 'icon' : 'lg'}
            variant={'ghost'}
            className={cn(
              "flex px-1 w-full h-10",
              isCollapsed ? 'justify-center w-fit mx-auto size-10' : 'justify-between'
            )}
          >
            <div className={cn("flex items-center w-full", isCollapsed && 'w-fit')}>
              <Avatar className="">
                <AvatarImage
                  src={data?.user.image || ''}
                  alt="user avatar"
                />
                <Skeleton>
                  <AvatarFallback></AvatarFallback>
                </Skeleton>
              </Avatar>
              <div className={isCollapsed ? 'hidden': 'flex items-center w-full justify-between mx-2'}>
                <p className="text-sm text-start text-muted-foreground truncate grow pt-0.5">{data?.user.name}</p>
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
