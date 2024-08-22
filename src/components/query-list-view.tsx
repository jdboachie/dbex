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
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import EmptyState from "@/components/closet/empty-state";
import { ServerIcon } from "@/components/icons";


interface QueryWithConnection extends Query {
  relatedConnection: Connection;
}

const QueryListView = () => {

  const router = useRouter()
  const pathname = usePathname()
  const [queries, setQueries] = React.useState<QueryWithConnection[]>([])

  React.useEffect(() => {
    const performEffect = async () => {
      await fetchAllQueries().then((res) => { res && setQueries(res) })
    }
    performEffect();
  }, [])

  const handleDelete = async (query: Query) => {
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

  const [searchInputValue, setSearchInputValue] = useState("");

  const filterQueries = queries.filter(query =>
    query.name.toLowerCase().includes(searchInputValue.toLowerCase())
  );

  const [isShowInput, setIsShowInput] = useState(false);
  const toggleIsShowInput = () => {
    if (isShowInput === true) setSearchInputValue('');
    setIsShowInput(!isShowInput);
  }

  return (
    <div className="flex flex-col items-stretch">
      <div className="flex flex-row justify-between px-4 py-3.5 border-b w-full items-center relative">
        <Link href={'/app/queries'} className='flex gap-4 px-4 items-center hover:text-primary animate-all'>
          <TerminalWindowIcon className='size-4 ml-1' />
          <p className='text-base font-medium'>Queries</p>
        </Link>
        <div className="absolute right-2 left-2">
          <Button title="Search Connections" onClick={toggleIsShowInput} className="bg-transparent border-0 hover:bg-transparent absolute right-0">
            {
              !isShowInput ? (
                <MagnifyingGlassIcon className="text-secondary-foreground" />
              ) : (
                <Cross2Icon className="h-4 w-4 text-secondary-foreground" />
              )
            }
          </Button>
          <Input
            className={`${isShowInput ? 'w-full bg-primary-foreground' : 'w-0 border-0 bg-transparent invisible'} border-2 focus:border-primary-foreground px-3 py-2 animate-all`}
            placeholder="Search connections..."
            value={searchInputValue}
            onChange={(e) => {
              setSearchInputValue(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="p-4 border-b grid">
        <Link
          href={`/app/queries`}
          className={cn(buttonVariants({ size: 'lg', variant: 'ghost' }), 'w-full justify-start border border-dashed px-3')}
        >
          <PlusIcon className='block size-4 mr-2.5 h-12' />
          New query
        </Link>
      </div>
      {
        queries.length >= 1 ? (
          searchInputValue === "" ? (
            <AnimatedState>
              <ScrollArea className='size-full p-4'>
                <div className="grid gap-1">
                  {queries.map((query) => (
                    <ContextMenu key={query.id}>
                      <ContextMenuTrigger>
                        <Link
                          className={cn(
                            buttonVariants({ variant: pathname.endsWith(query.id) ? 'secondary' : 'ghost', size: 'default' }),
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
                        <ContextMenuItem onClick={() => { handleDelete(query) }}>
                          <p className="text-red-500 hover:text-red-500">Delete</p>
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                </div>
              </ScrollArea>
            </AnimatedState>
          ) : (
            filterQueries.length >= 1 ? (
              <AnimatedState>
                <ScrollArea className='size-full p-4'>
                  <div className="grid gap-1">
                    {filterQueries.map((query) => (
                      <ContextMenu key={query.id}>
                        <ContextMenuTrigger>
                          <Link
                            className={cn(
                              buttonVariants({ variant: pathname.endsWith(query.id) ? 'secondary' : 'ghost', size: 'default' }),
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
                          <ContextMenuItem onClick={() => { handleDelete(query) }}>
                            <p className="text-red-500 hover:text-red-500">Delete</p>
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    ))}
                  </div>
                </ScrollArea>
              </AnimatedState>
            ) : (
              <EmptyState
                small
                icon={ServerIcon}
                title={'No Queries Found'}
              // description={'Add a connection to get started'}
              />
            )

          )

        ) : (
          <EmptyState
            small
            icon={ServerIcon}
            title={'No Queries Yet'}
          // description={'Add a connection to get started'}
          />
        )
      }

    </div >
  )
}


export { QueryListView }