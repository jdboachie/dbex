import { TerminalWindowIcon, TableIcon, ServerIcon } from "./icons";
import { Analytics } from "@/lib/actions";

export const RecentQueries = () => {

    interface Query {
        title: string,
        description: string,
        timestamp: string,
        icon: React.FC<any>
    }

    const Queries: Query[] = [
        {
            title: 'get_cwa',
            description: 'Select * from CWA where value > 70; ...',
            timestamp: '2 hours ago',
            icon: TerminalWindowIcon
        },
        {
            title: 'get_cwa_v2',
            description: 'Select * from CWA_v2 where value > 70; ...',
            timestamp: '1 day ago',
            icon: TerminalWindowIcon
        },
        {
            title: 'get_cwa_v3',
            description: 'Select * from CWA_v3 where value > 70; ...',
            timestamp: '2 days ago',
            icon: TerminalWindowIcon
        },
    ];

    return (
        <>
            {
                Queries.length > 0 ? (
                    Queries.map((query: Query, index: number) => {
                        return (
                            <a key={index} href='#' className='flex w-full flex-row justify-between hover:bg-primary-foreground dark:hover:text-secondary bg-secondary p-3 rounded-lg'>
                                <div className="flex dark:text-secondary-foreground flex-col justify-center gap-2">
                                    <div className='flex flex-row items-center gap-1'>
                                        <query.icon className="size-4" />
                                        <div className='uppercase'>{query.title}</div>
                                    </div>
                                    <div className='text-muted-foreground'>
                                        {query.description}
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {query.timestamp}
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


export const AnalyticsComponent = async() => {
    interface IAnalytics {
        component: string,
        value: number,
        icon: React.FC<any>
    }

    const {queries, connection} = await Analytics();
    const analytics: IAnalytics[] = [
        { component: "Tables", value:10, icon: TableIcon },
        { component: "Connection", value: queries, icon: ServerIcon },
        { component: "Queries", value: connection, icon: TerminalWindowIcon }
    ]
    return (
        <>
            {
                analytics.map((item: IAnalytics, index: number) => {
                    return (
                        <div key={index} className="flex w-full flex-row justify-between hover:bg-primary-foreground dark:hover:text-secondary bg-secondary p-3 rounded-lg">
                            <div className='flex flex-row justify-between bg-secondary rounded-lg w-full'>
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