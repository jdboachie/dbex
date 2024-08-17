'use client'

import * as React from 'react'
import { cn } from "@/lib/utils";
import Nav from "@/components/nav";
import UserButton from "@/components/auth/user-button";
import { ResizablePanel } from "@/components/ui/resizable";
import { CommandDialogButton } from "@/components/command-dialog";
import { ThemeToggle, ThemeToggleAlt } from "@/components/theme/theme-toggle";
import UserButtonSkeleton from "@/components/closet/skeletons/UserButtonSkeleton";
import { Empty } from '../ui/empty';
import { DbexIcon } from '../icons';

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
        "flex flex-col gap-4 mx-2",
        isCollapsed &&
          "min-w-[50px] animate-all items-center",
      )}
    >
      <div className={cn("flex flex-row items-center gap-2 h-12 px-2 w-full", isCollapsed && 'px-1 justify-center')}>
        {/* <Empty className={cn('size-full min-h-10 min-w-10', isCollapsed && 'size-10')}> <Empty/> */}
        <DbexIcon className={cn('size-9 min-h-9 min-w-9 ', isCollapsed && 'size-5')} />
        <span className={`text-primary font-bold font-mono text-xl ${isCollapsed?'hidden':''}`}>DBEX</span>
      </div>
      <div className=''>
        <Nav isCollapsed={isCollapsed} />
      </div>
      <div className="grow p-2">
        <CommandDialogButton navCollapsed={isCollapsed} />
      </div>
      <div className="p-2 grid">
        {isCollapsed ? <ThemeToggleAlt /> : <ThemeToggle />}
      </div>
      <div>
        <UserButton isCollapsed={isCollapsed} />
      </div>
    </ResizablePanel>
  )
}

export default MainNav