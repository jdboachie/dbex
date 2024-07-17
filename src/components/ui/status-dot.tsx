import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import React from 'react'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'


type State = 'dormant' | 'wait' | 'failed' | 'ok'

const statusVariants = cva(
  "size-2.5 rounded-full cursor-help",
  {
    variants: {
      state: {
        dormant:
          "bg-secondary",
        wait:
          "bg-amber-500",
        failed:
          "bg-red-700",
        ok:
          "bg-green-500",
      },
    },
    defaultVariants: {
      state: "dormant",
    },
  }
)


const StatusDot = (
  {state = 'dormant', className} : {state?: State, className?: string}
) => {
  return (
    <Tooltip>
      <TooltipTrigger className={'w-fit h-fit'}>
        <div
          className={cn(statusVariants({state}), className)}
        />
      </TooltipTrigger>
      <TooltipContent>
        {state}
      </TooltipContent>
    </Tooltip>
  )
}

export default StatusDot