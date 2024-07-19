import React from 'react'
import {Skeleton} from "@/components/ui/skeleton";
import { Empty } from '@/components/ui/empty';

const UserButtonSkeleton = ({isCollapsed}: {isCollapsed: boolean}) => {
  return (
    <Skeleton className='border-y-none bg-transparent shadow-none rounded-md p-1 h-10 flex items-center justify-between gap-2'>
      <div className="flex items-center gap-1">
        <Empty className="size-8 rounded-lg"/>
        <Empty className={`w-24 h-3 rounded-sm ${isCollapsed && 'hidden'}`}/>
      </div>
      <Empty className={`w-6 h-3 mr-2 rounded-sm ${isCollapsed && 'hidden'}`}/>
    </Skeleton>
  )
}

export default UserButtonSkeleton