'use client';

import { z } from "zod"
import {
    Card,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { ZeroConfigIcon } from "./icons";
import { SendMail } from "@/lib/actions";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchConnections } from "@/lib/actions";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { userQueries, Analytics } from "@/lib/actions";
import EmptyState from '@/components/closet/empty-state';
import { TerminalWindowIcon, TableIcon, ServerIcon, FeedbackIcon } from "./icons";
import { ScrollArea } from "./ui/scroll-area";
import Link from "next/link";
import StatusDot from "./ui/status-dot";


export const RecentQueries = () => {
    interface queries {
        id: string,
        userId: string,
        connectionId: string,
        name: string,
        content: string | null,
        emojiUrl: string | null,
        createdAt: Date,
        updatedAt: Date
    }

    const [queries, setQueries] = useState<queries[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await userQueries();
            setQueries(res);
        }
        fetchData();
    }, []);

    const timestamp = (time: Date) => {
        if (time) {
            const milliseconds = Date.now() - new Date(time).getTime();
            const seconds = Math.floor(milliseconds / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            if (days > 0) return days + 'days'
            else if (hours > 0) return hours + 'hours'
            else if (minutes > 0) return minutes + 'minutes'
            else return seconds + 'seconds'
        }
        return '';
    }

    return (
      <ScrollArea  className='h-full'>
        <div className="max-h-[300px] flex flex-col gap-2">
        {queries.length > 0 ? (
          queries.map((query, index) => {
            return (
              <Link key={index} href={`/app/queries/${query.id}`} className='bg-primary-foreground hover:secondary border p-2 rounded-md relative'>
                <div className="flex dark:text-secondary-foreground flex-col justify-center gap-2">
                  <div className='flex flex-row items-center gap-2'>
                    <Image
                      src={query.emojiUrl ? query.emojiUrl : ''}
                      alt='queryemoji'
                      width={1000}
                      height={1000}
                      className='size-5'
                    />
                    <p className="leading-none">{query.name}</p>
                  </div>
                  {query?.content &&
                    <div className='text-xs font-mono text-muted-foreground text-ellipsis whitespace-nowrap '>
                      {query?.content.length > 60 ? query?.content.slice(0, 60) + '...' : query?.content}
                    </div>
                  }
                </div>
                <div className="text-xs p-2 text-muted-foreground whitespace-nowrap absolute top-0 right-0">
                  {timestamp(query.updatedAt) === '' ? '' : timestamp(query.updatedAt) + ' ago'}
                </div>
              </Link>
            )
          })
          ) : (
            <div className="flex flex-col justify-center items-center">
              <EmptyState
                small
                icon={ZeroConfigIcon}
                title='No queries on this database'
                description="Click on the 'Query database' to run a query"
              />
            </div>
          )
        }
        </div>
      </ ScrollArea>
    );
}

export const AnalyticsComponent = () => {
    interface IAnalytics {
        component: string,
        value: number,
        icon: React.FC<any>
    }

    const [analytics, setAnalytics] = useState<IAnalytics[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        const { queries, connection } = await Analytics();
        const data: IAnalytics[] = [
          { component: "Tables", value: 10, icon: TableIcon },
          { component: "Connection", value: connection, icon: ServerIcon },
          { component: "Queries", value: queries, icon: TerminalWindowIcon }
        ];
        setAnalytics(data);
      };

      fetchData();
    }, []);
    return (
        <>
            {
                analytics.map((item: IAnalytics, index: number) => (
                    <div key={index} className="flex w-full flex-row justify-between hover:bg-primary-foreground dark:hover:text-secondary bg-secondary p-3 rounded-lg transition-colors">
                        <div className='flex flex-row justify-between rounded-lg w-full'>
                            <div className="flex flex-row items-center gap-1 text-muted-foreground">
                                {<item.icon className="size-4 text-muted-foreground" />}
                                <div className='text-xs'>{item.component}</div>
                            </div>
                            <div className="text-lg">
                                {item.value}
                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    );
}

export const FeedbakCard = ({className}:{className?:string}) => {

    const FeedbackForm = z.object({
        email: z.string().email({
            message: "Invalid email address"
        }),
        message: z.string()
    })

    const form = useForm<z.infer<typeof FeedbackForm>>({
        resolver: zodResolver(FeedbackForm),
        defaultValues: {
            email: "",
            message: ""
        },
    })

    const handleSubmit = (values: z.infer<typeof FeedbackForm>) => {
        // Submit the form
        SendMail(values.email, values.message)
    }
    return (
        <Card className={`{classsName} shadow border h-full dark:bg-custom-gradient bg-bottom  rounded-lg py-4 px-5 relative`}>
            <div className="flex justify-between flex-col gap-3">
                <div className='flex gap-3 flex-col items-center justify-center'>
                    <div className="icon bg-secondary w-fit p-3 rounded-lg">
                        <FeedbackIcon className="size-5 text-primaryblue" />
                    </div>
                    <div className="flex flex-col gap-1 items-center justify-center text-center">
                        <CardTitle className='text-lg'>Feedback</CardTitle>
                        <CardDescription className='w-12/12'>
                            Your Feedback helps us improve the performance this application
                        </CardDescription>
                        <div className="py-5">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>Send Feeback</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Send Feeback</DialogTitle>
                                        <DialogDescription>
                                            Our team will review your feedback and get back to you
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="form-wrapper rounded-lg p-5 relative z-50">
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm">Email</FormLabel>
                                                            <FormControl>
                                                                <div className="input-icon flex flex-row relative">
                                                                    <Input type="email" placeholder="Enter mail" {...field} className="text-muted-foreground rounded-lg" />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="message"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm">Message</FormLabel>
                                                            <FormControl>
                                                                <div className="input-icon flex flex-row relative">
                                                                    <Textarea {...field} placeholder="Type your message here." />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="flex flex-col items-end justify-end py-4">
                                                    <DialogClose asChild>
                                                        <Button type="submit" className="w-1/2 dark:bg-secondary bg-secondary-foreground dark:hover:bg-secondary-foreground dark:text-secondary-foreground dark:hover:text-secondary">Submit</Button>
                                                    </DialogClose>
                                                </div>
                                            </form>
                                        </Form>
                                    </div>
                                </DialogContent>
                            </Dialog>

                        </div>
                    </div>
                </div>

            </div>
        </Card>
    )
}

export const RecentConnections = () => {
    interface ConnectionTemplate {
        id: string;
        userId: string;
        username: string;
        hostname: string;
        password: string;
        port: number;
        protocol: string;
        databaseName: string;
        isConnected: boolean;
        ssl: boolean | null;
        customName: string;
    }

    const [connections, setConnections] = useState<ConnectionTemplate[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        const connections = await fetchConnections();
        setConnections(connections);
      }
      fetchData()
    }, []);


    return (
      <ScrollArea>
        <div className="max-h-[300px] flex flex-col gap-2">
          {connections.length > 0 ? connections.map((connection, index) => {
            return (
              <Link key={index} href={`/app/connections/${connection.id}`} className="bg-primary-foreground border flex w-full flex-row justify-between p-2 rounded-md relative hover:bg-secondary transition-all">
                <div className="flex dark:text-secondary-foreground flex-col justify-center gap-1">
                  <p>{connection.customName}</p>
                  <p className="text-muted-foreground truncate text-xs font-mono">{connection.username}</p>
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap absolute right-5">
                  {connection.isConnected ? (
                    <StatusDot state="ok" />
                  ) : (
                    <StatusDot state="failed" />
                  )}
                </div>
              </Link>
            )
            }) : (
              <div className="flex flex-col justify-center items-center">
                <EmptyState
                  small
                  icon={ZeroConfigIcon}
                  title='0 connections Found'
                  description="Click on the Connect to Database"
                />
              </div>
            )
          }
        </div>
      </ScrollArea>
    )
}