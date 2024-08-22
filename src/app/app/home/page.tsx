'use client';

import React from 'react'
import {
  DatabaseIcon,
  TerminalWindowIcon,
  ServerIcon
} from '@/components/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { Code2 as Code } from 'lucide-react';
import { DbSvg } from '@/components/svgImage';
import { Button } from '@/components/ui/button'
import { ChartComponent } from '@/components/chart-list';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizablePanel } from '@/components/ui/resizable';
import { Folder as CodeIcon } from "@phosphor-icons/react";
import { RecentConnections } from '@/components/home-page';
import { RecentQueries, FeedbakCard } from '@/components/home-page';


const Page = () => {

  const router = useRouter();

  return (
      <ScrollArea className='h-full'>
        <div className="h-full grid p-4 gap-4 grid-cols-2 2xl:grid-cols-3">
          {/* <Card className='shadow-none'>
            <div className="flex justify-between flex-col gap-3 w-1/2">
              <div className='flex gap-3 flex-col'>
                <div className="icon bg-secondary w-fit p-3 rounded-lg">
                  <DatabaseIcon className="size-4 text-primaryblue" />
                </div>
                <div className="flex flex-col gap-1">
                  <CardTitle className='text-lg'>Connect To Database</CardTitle>
                  <CardDescription className='w-11/12'>
                    Connect to your database and run queries on your data with just a click
                  </CardDescription>
                </div>
              </div>
              <div className="footer flex flex-row gap-2 py-2">
                <div className='flex flex-row rounded-lg items-center gap-1'>
                  <Button onClick={() => router.push('/app/connections')} size={'lg'} className='flex flex-row items-center gap-2 bg-primaryblue hover:bg-primaryblue-foreground'>
                    <ServerIcon />
                    <span>Connect</span>
                  </Button>
                </div>
                <div className='flex flex-row rounded-lg items-center gap-1'>
                  <Button onClick={() => router.push('/app/queries')} size={'lg'} className='flex flex-row items-center gap-2'>
                    <Code />
                    <span>Query Database</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className='w-1/2'>
              <DbSvg className="size-11/12"></DbSvg>
            </div>
          </Card> */}
          <Card className='shadow-none'>
            <CardHeader className='flex-row gap-4 items-center'>
              <div className="icon bg-secondary w-fit p-3 rounded-lg">
                <TerminalWindowIcon className="size-4 text-primaryblue" />
              </div>
              <CardTitle>
                Recent Queries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentQueries />
            </CardContent>
          </Card>
          <Card className='shadow-none'>
            <CardHeader className='flex-row items-center gap-4'>
              <div className="icon bg-secondary w-fit p-3 rounded-lg">
                <ServerIcon className="size-5 text-primaryblue" />
              </div>
              <CardTitle>Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentConnections />
            </CardContent>
          </Card>
        </div>
        {/* <div className="">
          <ChartComponent />
          <Card className='shadow border grid col-span-5 lg:col-span-3 h-full dark:bg-custom-gradient bg-bottom  rounded-lg py-4 px-5 relative'>
            <div className="flex justify-between flex-col gap-3">
              <div className='flex gap-3 flex-col items-center justify-center'>
                <div className="icon bg-secondary w-fit p-3 rounded-lg">
                  <CodeIcon className="size-4 text-primaryblue" />
                </div>
                <div className="flex flex-col gap-1 items-center justify-center text-center">
                  <CardTitle className='text-lg'>View Project</CardTitle>
                  <CardDescription className='w-12/12'>
                    Postgres database the world&apos;s most trusted relational database.
                  </CardDescription>
                  <div className="py-5">
                    <Button>
                      <a href="https://github.com/jdboachie/dbex" target="_blank">
                        View Project
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </Card>
          <FeedbakCard></FeedbakCard>
        </div> */}
      </ScrollArea>
  )
}

export default Page