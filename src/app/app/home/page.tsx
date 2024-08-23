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

        <div className="grid grid-cols-3 p-4 gap-4">
          <ChartComponent className='col-span-1'/>
          <Card className='shadow border grid col-span-1 h-full dark:bg-custom-gradient bg-bottom  rounded-lg py-4 px-5 relative'>
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
          <FeedbakCard className="col-span-1"></FeedbakCard>
        </div>
      </ScrollArea>
  )
}

export default Page