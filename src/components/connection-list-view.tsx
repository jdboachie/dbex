'use client'

import {
  PlusIcon,
  ServerIcon,
  PostgresAltIcon,
  MoreHorizontalIcon,
  MagnifyingGlassIcon,
} from "./icons"
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { z } from "zod"
import Link from "next/link"
import * as React from 'react'
import { toast } from "sonner"
import StatusDot from "./ui/status-dot";
import { testConnection } from "@/lib/pg"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import EmptyState from "./closet/empty-state"
import { Badge } from '@/components/ui/badge'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { deleteConnection } from "@/lib/actions"
import { Connection } from '@prisma/client/edge'
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { parsePostgresConnectionString } from "@/lib/utils"
import { AnimatedState } from "./experimental/animated-state"
import { createConnection, fetchUserByEmail, fetchConnections } from "@/lib/actions"


const ConnectionStringFormSchema = z.object({
  connectionString: z.string().min(1, { message: "Connection string is required." }),
})

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
            setConnections([res, ...connections]);
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
      deleteConnection(connection.id)
        .then(() => {
          router.push('/app/connections')
        }),
      {
        loading: `Deleting ${connection.databaseName}...`,
        success: () => {
          const newConnectionsList = connections.filter(item => item.id !== connection.id)
          setConnections(newConnectionsList)
          return `Deleted successfully`
        },
        error: `Error deleting ${connection.databaseName}`
      }
    );
  }

  return (
    <div className="flex flex-col items-stretch">
      <Link href={'/app/connections'} className='flex gap-4 border-b px-4 py-3.5 items-center hover:text-primary animate-all'>
        <ServerIcon className='size-4 ml-1' />
        <p className='text-base font-medium'>Connections</p>
      </Link>
      <div className="p-4 border-b grid">
        <Dialog>
          <DialogTrigger>
            <Button
              variant={'ghost'}
              size={'lg'}
              className='w-full justify-start border border-dashed px-3'
            >
              <PlusIcon className='block size-5 mr-2.5' />
              Add connection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New connection</DialogTitle>
              <DialogDescription>
                Add a new database connection by filling in the form below
              </DialogDescription>
            </DialogHeader>
            <div className="grid">
              <Tabs defaultValue="connection-string" className="w-full">
                <div className="grid w-fit mr-auto px-6 pt-2">
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
                          <Button size={'lg'} variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button size={'lg'} type="submit">Save changes</Button>
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
      <ScrollArea className="p-4">
        {connections.length >= 1 ?
          <AnimatedState>
            {connections.map((connection) => (
              <div
                key={connection.id}
                onClick={() => {router.push(`/app/connections/${connection.id}`)}}
                className='cursor-pointer relative border hover:shadow-sm transition-shadow duration-200 ease-out rounded-lg hover:text-primary p-4 mb-2 h-fit flex gap-3 items-center justify-start'
              >
                <PostgresAltIcon className="size-10"/>
                <div className="grid grid-flow-row w-full gap-1 items-center justify-start">
                  <div className="items-center grid grid-cols-2">
                    <p className="text-start truncate text-sm font-medium">{connection.databaseName}</p>
                    <div className="grid justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-md absolute top-2 right-2 p-1 hover:bg-secondary">
                          <MoreHorizontalIcon className="size-4 min-w-4"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => {router.push(`/app/connections/${connection.id}`)}}>View</DropdownMenuItem>
                          {/* <DropdownMenuItem disabled>Update</DropdownMenuItem>
                          <DropdownMenuItem disabled>Share</DropdownMenuItem> */}
                          <DropdownMenuItem
                            className="hover:bg-destructive"
                            onClick={() => {handleDelete(connection)}}
                          >
                            <p className="text-red-500">
                              Delete
                            </p>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <Badge variant={'secondary'} className='px-1 truncate w-full gap-1 text-xs font-medium text-muted-foreground'>
                    {connection.isConnected ? (
                      <StatusDot state="ok" />
                    ) : (
                      <StatusDot />
                    )}
                    <p className="w-fit truncate">
                      {connection.hostname}:{connection.port}
                    </p>
                  </Badge>
                </div>
              </div>
            ))}
          </AnimatedState>
          :
          <EmptyState
            small
            icon={ServerIcon}
            title={'No connections yet'}
            // description={'Add a connection to get started'}
          />
        }
      </ScrollArea>
    </div>
  )
}

export { ConnectionsListView }