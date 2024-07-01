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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import ConnectionCardSkeleton from '@/components/closet/skeletons/ConnectionCardSkeleton';
import { fetchAllConnections } from "@/lib/actions";


const ConnectionsListView = async () => {

  const connections: Connection[] = await fetchAllConnections()

  return (
    <Tabs defaultValue="all">
      <div className="grid grid-cols-2 py-2 px-4">
      <p className="py-1.5 font-medium text-muted-foreground">Connections</p>
        <TabsList className="w-full">
          <TabsTrigger value="all" className="w-full"> All </TabsTrigger>
          <TabsTrigger value="active" className="w-full"> Active </TabsTrigger>
        </TabsList>
      </div>
      <Separator />
      <div className="p-4">
        <form>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-8" />
          </div>
        </form>
      </div>
      <TabsContent value="all" className="m-0 px-4">
        <div className='grid grid-flow-row gap-2 size-full'>
          {connections.map((connection) => (
            <ContextMenu key={connection.id}>
              <ContextMenuTrigger className='border bg-card dark:bg-primary-foreground drop-shadow-sm rounded-lg p-4 grid gap-2'>
                <div className="flex gap-4 items-center justify-start">
                  <PostgresIcon className="size-10 text-muted-foreground"/>
                  <p className="font-medium">{connection.databaseName}</p>
                </div>
                <Badge variant={'secondary'} className='truncate font-medium'>
                  {connection.isConnected ? (
                    <div className="block bg-green-500 size-3 min-w-3 mr-2 animate-pulse rounded-full" />
                  ) : (
                    <div className="block bg-neutral-500 size-3 min-w-3 mr-2 rounded-full" />
                  )}
                  <p className="w-fit truncate">
                    {connection.hostname}
                  </p>
                </Badge>
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
      <TabsContent value="active" className="m-0 px-4">
        <ConnectionCardSkeleton />
      </TabsContent>
    </Tabs>
  )
}


export { ConnectionsListView }