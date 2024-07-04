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
import { Connection, Query } from '@prisma/client/edge';
import { fetchAllQueries } from '@/lib/actions';
import { Button } from "./ui/button";
import Image from "next/image";
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
import { Badge } from "./ui/badge";


const QueryListView = async () => {

  const queries = await fetchAllQueries()

  return (
    <Tabs defaultValue="all">
      <div className="grid grid-cols-2 py-2 px-4">
      <p className="py-1.5 font-medium text-muted-foreground">Queries</p>
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
      <TabsContent value='all'>
        <div className='grid grid-flow-row gap-1 size-full px-4'>
          {queries.map((query) => (
            <ContextMenu key={query.id}>
              <ContextMenuTrigger>
                <Button
                  variant={'ghost'}
                  className="flex gap-2 px-2 w-full font-normal justify-start"
                >
                  <Image
                    src={query.emojiUrl || ''}
                    alt={'query emoji'}
                    width={1000}
                    height={1000}
                    className="size-5"
                  />
                  {query.name}
                  <Badge variant={'outline'}>{query.relatedConnection.databaseName}</Badge>
                </Button>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-56">
                <ContextMenuCheckboxItem checked>
                  Change this
                  <ContextMenuShortcut>⌘⇧C</ContextMenuShortcut>
                </ContextMenuCheckboxItem>
                <ContextMenuItem inset>
                    View
                </ContextMenuItem>
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


export { QueryListView }