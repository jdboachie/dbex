import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuShortcut,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuCheckboxItem,
} from "@/components/ui/context-menu"
import React from 'react';
import { Badge } from '@/components/ui/badge'
import { Connection } from '@prisma/client/edge';
import { Lock as LockIcon, User as UserIcon } from '@phosphor-icons/react/dist/ssr';
import { PostgresIcon } from "./icons";
import Link from "next/link";
import {
  MagnifyingGlass as MagnifyingGlassIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchAllConnections } from "@/lib/actions";
import { Separator } from "@/components/ui/separator";
import ConnectionCardSkeleton from '@/components/closet/skeletons/ConnectionCardSkeleton';


const ConnectionsListView = async () => {

  // const connections: Connection[] = []
  const connections: Connection[] = await fetchAllConnections()

  return (
    <Tabs defaultValue="all" className="flex flex-col items-stretch h-screen">
      <div className="grid p-2">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="w-full"> All </TabsTrigger>
          <TabsTrigger value="active" className="w-full"> Active </TabsTrigger>
        </TabsList>
      </div>
      <Separator />
      <div className="p-4">
        <form>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-2 top-2.5 size-5 text-muted-foreground" />
            <Input placeholder="Search" className="pl-8" />
          </div>
        </form>
      </div>
      <ScrollArea className='pb-8'>
        <TabsContent value="all" className="m-0 grid px-2">
          <div className='grid grid-flow-row size-full gap-2'>
            {connections.map((connection) => (
              <ContextMenu key={connection.id}>
                <ContextMenuTrigger className='grid'>
                  <Button variant='outline' className='p-2 px-4 h-20 flex gap-3 items-center justify-start'>
                    <PostgresIcon className="size-10"/>
                    <div className="grid grid-flow-row w-full gap-1 items-center justify-start">
                      <p className="text-start font-normal truncate text-sm">{connection.databaseName}</p>
                      <Badge variant={'secondary'} className='px-1 truncate w-full font-normal font-mono text-xs tracking-tighter'>
                        {connection.isConnected ? (
                          <div className="block bg-green-500 size-3 min-w-3 mr-2 animate-pulse rounded-full" />
                        ) : (
                          <div className="block bg-neutral-500 size-3 min-w-3 mr-2 rounded-full" />
                        )}
                        <p className="w-fit truncate">
                          {connection.hostname}:{connection.port}
                        </p>
                      </Badge>
                    </div>
                  </Button>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-56">
                  <ContextMenuCheckboxItem checked={connection.isConnected}>
                    {connection.isConnected ? 'Disconnect' : 'Connect'}
                    <ContextMenuShortcut>⌘⇧C</ContextMenuShortcut>
                  </ContextMenuCheckboxItem>
                  <Link
                    href={`/app/connections/${connection.id}`}
                    >
                    <ContextMenuItem inset>
                        View
                    </ContextMenuItem>
                  </Link>
                  <ContextMenuItem inset>Delete</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuSub>
                    <ContextMenuSubTrigger inset>Export</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                      <ContextMenuItem>
                        CSV
                        {/* <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut> */}
                      </ContextMenuItem>
                      <ContextMenuItem>XLSX</ContextMenuItem>
                      <ContextMenuItem>HTML</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem>PDF</ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                </ContextMenuContent>
            </ContextMenu>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="active" className="m-0 px-4 pb-8 grid gap-2">
          <ConnectionCardSkeleton />
          <ConnectionCardSkeleton />
          <ConnectionCardSkeleton />
          {/* <ConnectionCardSkeleton />
          <ConnectionCardSkeleton /> */}
        </TabsContent>
      </ScrollArea>
    </Tabs>
  )
}


export { ConnectionsListView }