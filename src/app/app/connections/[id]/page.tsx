import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import LoadingUI from '@/components/loading-ui'
import { Button } from '@/components/ui/button'
import { Connection, Query } from '@prisma/client'
import { fetchConnectionById } from '@/lib/actions'
import { AnimatedState } from '@/components/experimental/animated-state'
import { GlobeIcon, DatabaseIcon, UserIcon, ConnectionIcon, PlayFillIcon, ZeroConfigIcon } from '@/components/icons'
import EmptyState from '@/components/closet/empty-state'
import { ScrollArea } from '@/components/ui/scroll-area'
import { runConnectionSpecificQuery } from '@/lib/pg'
import NotFoundUI from '@/app/not-found'
import Flow from '@/components/schemaflow'


// interface Column {
//   name: string;
//   type: number;
// }

// interface Row {
//   [key: string]: string | number;
// }

// interface Table {
//   columns: Column[];
//   rows: Row[];
// }

export default async function Page({ params }: { params: { id: string } }) {

  const data: Connection | null = await fetchConnectionById(params.id)

  if (!data) { return <NotFoundUI />}

  const relatedQueries: Query[] = await prisma.query.findMany({
    where: {
      connectionId : data?.id
    }
  })

  // let schemas: any[] = [];
  // let tables;

  // if (data) {

  //   tables = await runConnectionSpecificQuery(
  //     data,
  //     `
  //     SELECT table_name
  //     FROM information_schema.tables
  //     WHERE table_type = 'BASE TABLE'
  //     AND table_schema = 'public';
  //     `
  //   )
  //   // for (table in tables?.res) {

  //   // }
  //     await runConnectionSpecificQuery(
  //       data,
  //       `
  //       SELECT column_name, data_type
  //       FROM information_schema.columns
  //       WHERE table_name = '';
  //       `)
  // }

  return (
    data ? (
      <ScrollArea className="flex flex-col w-full h-full">
        <div className="h-[126px] border-b flex justify-between items-center px-10">
          <h2 className="text-5xl max-lg:text-3xl text-primary font-medium">
            {data.databaseName}
          </h2>
          <div className="grid grid-flow-col gap-2">
            <Link href={'/app/queries'} className='grid rounded-md'>
              <Button size={'lg'} className='w-fit'>
                <PlayFillIcon className='size-4 mr-3' />
                Query database
              </Button>
            </Link>
          </div>
        </div>
        <div className='p-10 grid gap-4'>
          <h5 className="text-base font-medium">Credentials</h5>
          <section className="text-primary grid grid-flow-row [&>*:nth-child(even)]:bg-background [&>*:nth-child(odd)]:bg-primary-foreground">
            <div className="p-2 px-3 flex gap-2 items-center rounded-sm">
              <DatabaseIcon className='size-4' />
              <span className='flex items-center'>
                <p className="w-20 text-muted-foreground text-sm">Schema</p><p>{data.databaseName}</p>
              </span>
            </div>
            <div className="p-2 px-3 flex gap-2 items-center rounded-sm">
              <GlobeIcon className='size-4' />
              <span className='flex items-center'>
                <p className="w-20 text-muted-foreground text-sm">Host</p><p>{data.hostname}</p>
              </span>
            </div>
            <div className="p-2 px-3 flex gap-2 items-center rounded-sm">
              <ConnectionIcon className='size-4'/>
              <span className='flex items-center'>
                <p className="w-20 text-muted-foreground text-sm">Port</p><p>{data.port}</p>
              </span>
            </div>
            <div className="p-2 px-3 flex gap-2 items-center rounded-sm">
              <UserIcon className='size-4' />
              <span className='flex items-center'>
                <p className="w-20 text-muted-foreground text-sm">Username</p><p>{data.username}</p>
              </span>
            </div>
          </section>
        </div>
        <div className="p-10 grid gap-4">
          <h5 className="text-base font-medium">Database Schemas</h5>
          <Flow id={data.id} />
      </div>
        <div className="p-10 grid gap-4">
          <h5 className="text-base font-medium">Related queries</h5>
          <AnimatedState>
            {relatedQueries.length > 0 ?
              <>
                {relatedQueries.map((query) => (
                  <Link key={query.id} href={`/app/queries/${query.id}`}>
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
                ))}
              </>
              :
              <EmptyState
                small
                icon={ZeroConfigIcon}
                title='No queries on this database'
                description="Click on the 'Query database' to run a query"
                className='z-0'
              />
              }
          </AnimatedState>
        </div>
      </ScrollArea>
    ) : (
      <LoadingUI />
    )
  )
}