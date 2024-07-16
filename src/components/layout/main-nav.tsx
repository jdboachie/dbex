'use client'

import * as React from 'react'
import { cn } from "@/lib/utils";
import Nav from "@/components/nav";
import { DbexIcon } from "@/components/icons"
import { Separator } from "@/components/ui/separator";
import UserButton from "@/components/auth/user-button"
import { ResizablePanel } from "@/components/ui/resizable";
import { ThemeToggle, ThemeToggleAlt } from "@/components/theme/theme-toggle";
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
      minSize={13}
      maxSize={17}
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
        "flex flex-col mr-2",
        isCollapsed &&
          "min-w-[50px] transition-all duration-300 ease-in-out items-center",
      )}
    >
      {/* <div className="py-2 px-4 flex gap-2 place-items-center">
        <DbexIcon className="size-6 -rotate-6 text-primary grayscale" />
        {!isCollapsed && <p className="text-base font-mono font-medium">DBEX</p> }
      </div> */}
      {/* <Separator className='bg-transparent' /> */}
      <div className=''>
        <Nav isCollapsed={isCollapsed} />
      </div>
      <div className="grow p-2">
        <CommandDialogButton navCollapsed={isCollapsed} />
      </div>
      <div className="grid p-2 gap-2">
        {isCollapsed ? <ThemeToggleAlt /> : <ThemeToggle />}
      </div>
      <div className="grid">
        <React.Suspense fallback={<UserButtonSkeleton isCollapsed={isCollapsed} />}>
          <UserButton isCollapsed={isCollapsed} />
        </React.Suspense>
      </div>
    </ResizablePanel>
  )
}

export default MainNav