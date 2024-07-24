import { TerminalWindowIcon, TableIcon, ServerIcon, FeedbackIcon } from "./icons";
import { userQueries, Analytics } from "@/lib/actions";
import Image from "next/image";
import {
    Card,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"

import { SendMail } from "@/lib/actions";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"

import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Input } from "./ui/input";
import { Button } from "@/components/ui/button";

export const RecentQueries = async () => {

    const Queries = await userQueries();
    const timestamp = (time: Date)=>{
        if(time){
           const milliseconds = Date.now() - new Date(time).getTime();
           const seconds = Math.floor(milliseconds / 1000);
           const minutes = Math.floor(seconds / 60);
           const hours = Math.floor(minutes / 60);
           const days = Math.floor(hours / 24);
           if(days > 0) return days + 'days'
           else if(hours > 0) return hours +'hours'
           else if(minutes > 0) return minutes +'minutes'
           else return seconds +'seconds'
        }
        return '';
    }

    return (
        <>
            {
                Queries.length > 0 ? (
                    Queries.map((query, index) => {
                        return (
                            <a key={index} href='#' className='flex w-full flex-row justify-between hover:bg-primary-foreground dark:hover:text-secondary bg-secondary p-3 rounded-lg'>
                                <div className="flex dark:text-secondary-foreground flex-col justify-center gap-2">
                                    <div className='flex flex-row items-center gap-1'>
                                        <Image
                                            src={query.emojiUrl? query.emojiUrl: ''}
                                            alt='queryemoji'
                                            width={1000}
                                            height={1000}
                                            className='size-5'
                                        />
                                        <div className='uppercase'>{query.name}</div>
                                    </div>
                                    <div className='text-muted-foreground text-ellipsis nowrap'>
                                        {query?.content}
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {timestamp(query.updatedAt) === ''? '': timestamp(query.updatedAt) + ' ago'}
                                </div>
                            </a>
                        )
                    })
                ) : (
                    <div className="text-sm text-muted-foreground">No recent queries</div>
                )
            }
        </>
    );
}


export const AnalyticsComponent = async () => {
    interface IAnalytics {
        component: string,
        value: number,
        icon: React.FC<any>
    }
    const {queries,connection} = await Analytics();
    const analytics: IAnalytics[] = [
        { component: "Tables", value: 10, icon: TableIcon },
        { component: "Connection", value: queries, icon: ServerIcon },
        { component: "Queries", value: queries, icon: TerminalWindowIcon }
    ]
    return (
        <>
            {
                analytics.map((item: IAnalytics, index: number) => {
                    return (
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
                    )
                })
            }
        </>

    )
}

export const FeedbakCard = () => {

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
        <Card className='shadow border grid col-span-3 lg:col-span-3 h-full dark:bg-custom-gradient bg-bottom  rounded-lg py-4 px-5 relative'>
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