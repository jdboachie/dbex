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
  FormDescription,
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
import { z } from "zod"
import * as React from 'react'
import { toast } from "sonner"
import { prisma } from "@/lib/prisma"
import { useForm } from "react-hook-form"
import { testConnection } from "@/lib/pg"
import { Connection } from "@prisma/client"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { createConnection, getUserById } from "@/lib/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircleIcon } from '@heroicons/react/16/solid'
import { parsePostgresConnectionString } from "@/lib/utils"


const ConnectionStringFormSchema = z.object({
  connectionString: z.string().min(1, { message: "Connection string is required." }),
})

function ConnectionStringForm() {

  const { data } = useSession()
  const [userId, setUserId] = React.useState<string>('')

  React.useEffect(() => {
    const getId = async () => {
      const res = await getUserById({email: data?.user?.email || ''})
                          .then((res) => {setUserId(res || '')})
    }
    getId()
  }, [data?.user?.email, userId]);

  const form = useForm<z.infer<typeof ConnectionStringFormSchema>>({
    resolver: zodResolver(ConnectionStringFormSchema),
  });

  async function onSubmit(data: z.infer<typeof ConnectionStringFormSchema>) {
    toast.promise(
      testConnection(data.connectionString),
      {
        loading: 'Loading...',
        success: () => {
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
            isConnected: true, // edit this later
          })
          return `Connected successfully`;
        },
        error: 'Error connecting to database'
      }
    )



    // toast.promise(

    //   {
    //     loading: 'Adding to your connections'}
    // )
    // setSettings({ user: username, password, host, port, database, ssl, connectionString: data.connectionString});
  }

  return (
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
  );

}

function AddConnectionButton() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant={'outline'}
          size={'lg'}
          className='w-full border-dashed '
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
              <ConnectionStringForm />
            </TabsContent>
            <TabsContent value="credentials"></TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddConnectionButton