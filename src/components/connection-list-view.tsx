'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DatabaseIcon, PostgresAltIcon } from "./icons";
import { Badge } from '@/components/ui/badge'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircleIcon, MagnifyingGlassIcon, EllipsisHorizontalIcon } from '@heroicons/react/16/solid'
import ConnectionCardSkeleton from '@/components/closet/skeletons/ConnectionCardSkeleton';

import { z } from "zod"
import Link from "next/link";
import * as React from 'react'
import { toast } from "sonner";
import { testConnection } from "@/lib/pg"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import { Connection, User } from '@prisma/client/edge';
import { zodResolver } from "@hookform/resolvers/zod"
import { parsePostgresConnectionString } from "@/lib/utils"
import { createConnection, fetchUserByEmail, fetchConnections } from "@/lib/actions"
import { deleteConnection } from "@/lib/actions";
import { useRouter } from "next/navigation"
import EmptyState from "./closet/empty-state"


// const shouldRefreshConnections: booolean = false
// global connections: Connection[] = []

const ConnectionStringFormSchema = z.object({
  connectionString: z.string().min(1, { message: "Connection string is required." }),
})

// function ConnectionStringForm() {

//   const { data } = useSession()
//   const [userId, setUserId] = React.useState<string>('')

//   React.useEffect(() => {
//     const getId = async () => {
//       await fetchUserByEmail(data?.user?.email || '')
//                  .then((res) => {res && setUserId(res.id)})
//     }

//     getId()
//   }, [data?.user?.email]);

//   const form = useForm<z.infer<typeof ConnectionStringFormSchema>>({
//     resolver: zodResolver(ConnectionStringFormSchema),
//   });

//   async function onSubmit(data: z.infer<typeof ConnectionStringFormSchema>) {
//     toast.promise(
//       testConnection(data.connectionString)
//         .then(() => {
//           const credentials = parsePostgresConnectionString(data.connectionString);
//           createConnection({
//             userId: userId,
//             username: credentials.username,
//             password: credentials.password,
//             hostname: credentials.hostname,
//             databaseName: credentials.databaseName,
//             protocol: credentials.protocol,
//             port: credentials.port,
//             ssl: credentials.ssl,
//             isConnected: true,
//           })
//         }),
//       {
//         loading: 'Connecting...',
//         success: `Connected successfully`,
//         error: 'Error connecting to database'
//       }
//     )
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="">
//         <div className="grid grid-flow-row gap-2 px-6">
//           <FormField
//             control={form.control}
//             name="connectionString"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Connection String</FormLabel>
//                 <FormControl>
//                   <Input spellCheck={false} {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <DialogFooter className="col-span-2">
//           <DialogClose asChild>
//             <Button size={'default'} variant="outline">Cancel</Button>
//           </DialogClose>
//           <DialogClose asChild>
//             <Button size={'default'} type="submit">Save changes</Button>
//           </DialogClose>
//         </DialogFooter>
//       </form>
//     </Form>
//   );

// }



const ConnectionsListView = () => {

  const router = useRouter()
  const { data } = useSession()

  const [userId, setUserId] = React.useState<string>('')
  const [connections, setConnections] = React.useState<Connection[]>([]);

  React.useEffect(() => {
    const getConnections = async () => {
      await fetchConnections().then((res: Connection[]) => {setConnections(res || [])})
    };
    getConnections();
  }, []);

  React.useEffect(() => {
    const getId = async () => {
      await fetchUserByEmail(data?.user?.email || '')
                 .then((res) => {res && setUserId(res.id)})
    }
    getId()
  }, [data?.user?.email]);

  const form = useForm<z.infer<typeof ConnectionStringFormSchema>>({
    resolver: zodResolver(ConnectionStringFormSchema),
  });

  async function onSubmit(data: z.infer<typeof ConnectionStringFormSchema>) {
    toast.promise(
      testConnection(data.connectionString)
        .then(() => {
          const credentials = parsePostgresConnectionString(data.connectionString);
          createConnection({
            userId: userId,
            username: credentials.username,
            password: credentials.password,
            hostname: credentials.hostname,
            databaseName: credentials.databaseName,
            protocol: credentials.protocol,
            port: credentials.port,
            ssl: credentials.ssl,
            isConnected: true,
          })
          .then((res) => {
            setConnections([...connections, res]);
            router.push(`/app/connections/${res.id}`)
          })
        }),
      {
        loading: 'Connecting...',
        success: `Connected successfully`,
        error: 'Error connecting to database'
      }
    )
  }

  const handleDelete = async (connection : Connection) => {
    toast.promise(
      deleteConnection(connection.id).then(() => router.push('/app/connections')),
      {
        loading: `Removing ${connection.databaseName}...`,
        success: () => {
          const newConnectionsList = connections.filter(item => item.id !== connection.id)
          setConnections(newConnectionsList)
          return `Deleted successfully`
        },
        error: `Error removing ${connection.databaseName}`
      }
    );
  }

  return (
    <Tabs defaultValue="all" className="flex flex-col items-stretch h-screen">
      <div className="grid border-b p-2 px-2 items-center">
        <TabsList>
          <TabsTrigger value="all" className="w-full">All</TabsTrigger>
          <TabsTrigger value="active" className="w-full">Active</TabsTrigger>
        </TabsList>
      </div>
      <div className="p-4">
        <form>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-8" />
          </div>
        </form>
      </div>
      <div className="grid px-4">
        <Dialog>
          <DialogTrigger>
            <Button
              variant={'ghost'}
              size={'lg'}
              className='w-full border border-dashed'
            >
              <PlusCircleIcon className='block size-5 mr-2.5 h-12' />
              Add connection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new connection</DialogTitle>
              <DialogDescription>
                Add a new connection by filling in the form below
              </DialogDescription>
            </DialogHeader>
            <div className="grid">
              <Tabs defaultValue="connection-string" className="w-full">
                <div className="grid w-fit mr-auto px-6 pt-6">
                  <TabsList>
                    <TabsTrigger value="connection-string">Connection string</TabsTrigger>
                    <TabsTrigger disabled value="credentials">Credentials</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="connection-string">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                      <div className="grid grid-flow-row gap-2 px-6">
                        <FormField
                          control={form.control}
                          name="connectionString"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Connection String</FormLabel>
                              <FormControl>
                                <Input spellCheck={false} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <DialogFooter className="col-span-2">
                        <DialogClose asChild>
                          <Button size={'default'} variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button size={'default'} type="submit">Save changes</Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </Form>
                </TabsContent>
                <TabsContent value="credentials"></TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea>
        <TabsContent value="all" className="m-0 dev h-full grid px-4 py-2">
          <React.Suspense fallback={<ConnectionCardSkeleton/>}>
            {connections.length >= 1 ?
              <div className='relative grid grid-flow-row size-full gap-2'>
                {connections.map((connection) => (
                  <Link
                    key={connection.id}
                      href={`/app/connections/${connection.id}`}
                    >
                    <div className='border rounded-lg transition-colors duration-250 ease-out hover:text-primary p-4 h-fit flex gap-3 items-center justify-start'>
                      <PostgresAltIcon className="size-10"/>
                      <div className="grid grid-flow-row w-full gap-1 items-center justify-start">
                        <div className="items-center grid grid-cols-2">
                          <p className="text-start truncate text-sm font-medium">{connection.databaseName}</p>
                          <div className="grid justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="rounded-full p-1 hover:bg-secondary">
                                <EllipsisHorizontalIcon className="size-4 min-w-4"/>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel className="font-mono tracking-tight">{connection.databaseName}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View</DropdownMenuItem>
                                <DropdownMenuItem>Billing</DropdownMenuItem>
                                <DropdownMenuItem>Team</DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {handleDelete(connection)}}
                                >
                                  <p className="text-red-500 hover:bg-desctruv">
                                    Remove connection
                                  </p>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
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
                    </div>
                  </Link>
                ))}
              </div>
              :
              <EmptyState
                small
                icon={DatabaseIcon}
                title={'No connections yet'}
                description={'Add a connection to get started'}
              />
            }
          </React.Suspense>
        </TabsContent>
        <TabsContent value="active" className="m-0 px-4 pb-8 grid gap-2">
          <ConnectionCardSkeleton />
          <ConnectionCardSkeleton />
          <ConnectionCardSkeleton />
          <ConnectionCardSkeleton />
          <ConnectionCardSkeleton />
        </TabsContent>
      </ScrollArea>
    </Tabs>
  )
}

export { ConnectionsListView }