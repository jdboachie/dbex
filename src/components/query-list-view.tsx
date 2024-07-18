import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchAllQueries } from '@/lib/actions';
import { Separator } from "@/components/ui/separator";
import ConnectionCardSkeleton from '@/components/closet/skeletons/ConnectionCardSkeleton';

import { PlusIcon, MagnifyingGlassIcon } from "./icons";


const QueryListView = async () => {

  const queries = await fetchAllQueries()

  return (
    <Tabs defaultValue="all">
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
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9" />
          </div>
        </form>
      </div>
      <div className=" grid px-4 mb-2">
        <Link href={'/app/queries'}>
          <Button
            variant={'ghost'}
            size={'lg'}
            className='w-full justify-start border border-dashed'
          >
            <PlusIcon className='block size-4 mr-2.5 h-12' />
            New query
          </Button>
        </Link>
      </div>
      <TabsContent value='all'>
        <div className='grid grid-flow-row gap-1 size-full px-4 py-2'>
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
                    {query.name}
                  </Button>
                </Link>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-56">
                <Link href={`/app/queries/${query.id}`}>
                  <ContextMenuItem inset>
                      View
                  </ContextMenuItem>
                </Link>
                <ContextMenuItem>Delete</ContextMenuItem>
                <ContextMenuSeparator />
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


export { QueryListView }