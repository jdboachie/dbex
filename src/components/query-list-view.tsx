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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { deleteQuery, fetchAllQueries } from '@/lib/actions';
import { Connection, Query } from "@prisma/client";
import { PlusIcon, MagnifyingGlassIcon, TerminalWindowIcon } from "./icons";
import { ScrollArea } from "./ui/scroll-area";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AnimatedState } from "./experimental/animated-state";


interface QueryWithConnection extends Query {
  relatedConnection: Connection;
}


const QueryListView = () => {

  const router = useRouter()
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
      <div className="p-4 border-b">
        <form>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9" />
          </div>
        </form>
      </div>
      <div className="grid p-4 pb-0">
        <Button
          size={'lg'}
          variant={'ghost'}
          onClick={() => {router.push('/app/queries')}}
          className='w-full justify-start border border-dashed px-3'
        >
          <PlusIcon className='block size-4 mr-2.5 h-12' />
          New query
        </Button>
      </div>
      <ScrollArea className='grid grid-flow-row gap-1 size-full p-4'>
        <AnimatedState>
          {queries.map((query) => (
            <ContextMenu key={query.id}>
              <ContextMenuTrigger>
                <Link href={`/app/queries/${query.id}`}>
                  <Button
                    variant={'ghost'}
                    className="flex gap-2 px-2 w-full justify-start"
                    >
                    <Image
                      src={query.emojiUrl || ''}
                      alt={'query emoji'}
                      width={1000}
                      height={1000}
                      className="size-5"
                      />
                      <p className="truncate">{query.name}</p>
                  </Button>
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
        </AnimatedState>
      </ScrollArea>
    </div>
  )
}


export { QueryListView }