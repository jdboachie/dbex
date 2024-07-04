'use client'

import * as React from 'react'
import { cn } from "@/lib/utils";
import Nav from "@/components/nav";
import { useSession } from "next-auth/react";
// import { DbexIcon } from "@/components/icons"
import { Separator } from "@/components/ui/separator";
import UserButton from "@/components/auth/user-button"
import { ResizablePanel } from "@/components/ui/resizable";
import { Empty } from "../ui/empty";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { CommandDialogButton } from "@/components/command-dialog";
import UserButtonSkeleton from "@/components/closet/skeletons/UserButtonSkeleton";

const MainNav = ({defaultSize, defaultCollapsed}: {defaultSize: number, defaultCollapsed: boolean}) => {

  const navCollapsedSize = 4;
  const resolvedSize = defaultCollapsed ? navCollapsedSize : defaultSize

  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(defaultCollapsed);

  return (
    <ResizablePanel
      defaultSize={resolvedSize}
      collapsedSize={navCollapsedSize}
      collapsible={true}
      minSize={10}
      maxSize={25}
      onCollapse={() => {
        setIsCollapsed(true);
        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
          true,
        )}`;
      }}
      onExpand={() => {
        setIsCollapsed(false);
        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
          false,
        )}`;
      }}
      className={cn(
        "flex flex-col",
        isCollapsed &&
          "min-w-[50px] transition-all duration-300 ease-in-out",
      )}
    >
      <div className="p-2 grid">
        <div className="flex gap-2">
          {/* <DbexIcon className="size-5 -rotate-6 text-primary" /> */}
          <Empty className="size-9" />
        </div>
      </div>
      <Separator />
      <div className="">
        <Nav isCollapsed={isCollapsed} />
      </div>
      <Separator />
      <div className="grow p-2">
        <CommandDialogButton navCollapsed={isCollapsed} />
      </div>
      <Separator />
      <div className="grid p-2 gap-2">
        <p className="text-muted-foreground text-sm px-2">
          Preferences
        </p>
        <div className="grid grid-flow-col items-center">
          <ThemeToggle />
        </div>
      </div>
      <Separator />
      <div className="grid">
        <React.Suspense fallback={<UserButtonSkeleton isCollapsed={isCollapsed} />}>
          <UserButton isCollapsed={isCollapsed} />
        </React.Suspense>
      </div>
    </ResizablePanel>
  )
}

export default MainNav