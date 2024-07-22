'use client'

import Link from "next/link";
import * as React from 'react';
import Image from "next/image";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { ScrollArea } from "./ui/scroll-area";
// import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Connection, Query } from "@prisma/client";
import { deleteQuery, fetchAllQueries } from '@/lib/actions';
import { AnimatedState } from "./experimental/animated-state";
import { PlusIcon, MagnifyingGlassIcon, TerminalWindowIcon } from "./icons";
import { cn } from "@/lib/utils";


interface QueryWithConnection extends Query {
  relatedConnection: Connection;
}

const QueryListView = () => {

  const router = useRouter()
  const pathname = usePathname()
  const [queries, setQueries] = React.useState<QueryWithConnection[]>([])

  React.useEffect(() => {
    const performEffect = async () => {
      await fetchAllQueries().then((res) => {res && setQueries(res)})
    }
    performEffect();
  }, [])

  const handleDelete = async (query : Query) => {
    toast.promise(
      deleteQuery(query.id).then(() => router.push('/app/queries')),
      {
        loading: `Removing ${query.name}...`,
        success: () => {
          const newQueriesList = queries.filter(item => item.id !== query.id)
          setQueries(newQueriesList)
          return `Deleted successfully`
        },
        error: `Error removing ${query.name}`
      }
    );
  }

  return (
    <div className="flex flex-col items-stretch">
      <Link href={'/app/queries'} className='flex gap-4 border-b px-4 py-3.5 items-center hover:text-primary animate-all'>
        <TerminalWindowIcon className='size-4 ml-1' />
        <p className='text-base font-medium'>Queries</p>
      </Link>
      <div className="p-4 border-b grid">
        <Link
          href={`/app/new`}
          className={cn(buttonVariants({size: 'lg', variant: 'ghost'}), 'w-full justify-start border border-dashed px-3')}
        >
          <PlusIcon className='block size-4 mr-2.5 h-12' />
          New query
        </Link>
      </div>
      <AnimatedState>
        <ScrollArea className='size-full p-4'>
          <div className="grid gap-1">
          {queries.map((query) => (
            <ContextMenu key={query.id}>
              <ContextMenuTrigger>
                <Link
                  className={cn(
                    buttonVariants({variant: pathname.endsWith(query.id) ? 'secondary' : 'ghost'}),
                    "flex gap-2 px-2 w-full justify-start"
                  )}
                  href={`/app/queries/${query.id}`}
                >
                  <Image
                    src={query.emojiUrl || ''}
                    alt={'query emoji'}
                    width={1000}
                    height={1000}
                    className="size-5"
                  />
                  <p className="truncate">{query.name}</p>
                </Link>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <Link href={`/app/queries/${query.id}`}>
                  <ContextMenuItem>
                      View
                  </ContextMenuItem>
                </Link>
                <ContextMenuItem onClick={() => {handleDelete(query)}}>
                  <p className="text-red-500 hover:text-red-500">Delete</p>
                </ContextMenuItem>
              </ContextMenuContent>
          </ContextMenu>
          ))}
          </div>
        </ScrollArea>
      </AnimatedState>
    </div>
  )
}


export { QueryListView }