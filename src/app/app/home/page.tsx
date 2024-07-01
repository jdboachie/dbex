'use client';

import React from 'react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

const Page = () => {
  const { data } = useSession()

  return (
    <div className="size-full relative flex flex-col items-center py-2 gap-4 px-4">
      <div className="homeConnectCard bg-primary-foreground dark:bg-custom-gradient w-full h-2/5 rounded-lg py-4 px-5 relative">
        <div className="flex flex-col justify-center h-full gap-2 w-1/2">
          <div className="hello-text text-muted-foreground">
            Welcome, {data?.user?.name}
          </div>
          <div className="bold-text font-bold text-4xl leading-tight">
            Connect to Database With Just a Click
          </div>
          <Button className="w-32 flex-row gap-2 text-lg my-2 flex items-center">
            Connect
            {/* <ArrowLeftIcon className="size-16 rotate-180 "></ArrowLeftIcon> */}
          </Button>
        </div>
      </div>

      <div className="doc-website flex justify-between w-full gap-4 h-2/5 relative">
        <div className="docs bg-primary-foreground shadow-sm dark:bg-custom-gradient w-full h-10/12 rounded-lg py-4 px-8 relative flex flex-col justify-center gap-2 items-center text-center">
          {/* <GoogleDocIcon className="size-16"></GoogleDocIcon> */}
          <div className="bold-text font-bold text-4xl leading-tight">
            Read Documentation
          </div>
        </div>
        <div className="docs bg-primary-foreground shadow-sm dark:bg-custom-gradient w-full h-10/12 rounded-lg py-4 px-8 relative">
          <div className="docs bg-primary-foreground shadow-sm dark:bg-custom-gradient w-full h-10/12 rounded-lg py-4 px-8 relative flex flex-col justify-center gap-2 items-center text-center">
            {/* <InternetIcon className="size-16"></InternetIcon> */}
            <div className="bold-text font-bold text-4xl leading-tight">
              Checkout Website
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page