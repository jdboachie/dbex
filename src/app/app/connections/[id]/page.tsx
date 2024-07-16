import Link from 'next/link'
import { Connection } from '@prisma/client/edge'
import { Button } from '@/components/ui/button'
import { fetchConnectionById } from '@/lib/actions'
import { PlugsConnected } from '@phosphor-icons/react/dist/ssr'
import { GlobeAltIcon, TableCellsIcon, UserIcon } from '@heroicons/react/16/solid'
import DeleteConnection from '@/components/delete-connection-button'
import Loading from './loading'


export default async function Page({ params }: { params: { id: string } }) {

  const data: Connection | null = await fetchConnectionById(params.id)

  return (
    data ? (
      <div className="grid divide-y max-w-5xl mx-auto">
        <div className="p-10 grid grid-flow-col">
          <h2 className="text-4xl text-primary font-medium">
            {data.databaseName}
          </h2>
          <div className="grid grid-flow-col gap-2">
            <Link href={'/app/queries'} className='grid rounded-md'>
              <Button size={'lg'}>Query database</Button>
            </Link>
            {/* <Button size={'lg'} variant={'outline'} className='text-red-500 hover:text-red-500'>
              Remove connection
            </Button> */}
            <DeleteConnection connectionId={data.id}/>
          </div>
        </div>
        <div className='p-10 grid gap-4'>
          <h5 className="text-xl font-semibold">Credentials</h5>
          <section className="text-primary grid grid-flow-row [&>*:nth-child(even)]:bg-background [&>*:nth-child(odd)]:bg-primary-foreground">
            <div className="p-2 px-3 flex gap-2 items-center rounded-sm">
              <TableCellsIcon className='size-5' />
              <span className='flex items-center'>
                <p className="w-20 text-muted-foreground text-sm">Schema</p><p className="font-mono tracking-tighter">{data.databaseName}</p>
              </span>
            </div>
            <div className="p-2 px-3 flex gap-2 items-center rounded-sm">
              <GlobeAltIcon className='size-5' />
              <span className='flex items-center'>
                <p className="w-20 text-muted-foreground text-sm">Host</p><p className="font-mono tracking-tighter">{data.hostname}</p>
              </span>
            </div>
            <div className="p-2 px-3 flex gap-2 items-center rounded-sm">
              <PlugsConnected className='size-5' weight='fill' />
              <span className='flex items-center'>
                <p className="w-20 text-muted-foreground text-sm">Port</p><p className="font-mono tracking-tighter">{data.port}</p>
              </span>
            </div>
            <div className="p-2 px-3 flex gap-2 items-center rounded-sm">
              <UserIcon className='size-5' />
              <span className='flex items-center'>
                <p className="w-20 text-muted-foreground text-sm">Username</p><p className="font-mono tracking-tighter">{data.username}</p>
              </span>
            </div>
          </section>
        </div>
      </div>
    ) : (
      <Loading />
    )
  )
}
