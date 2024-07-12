import { Connection } from '@prisma/client'
import { fetchConnectionById } from '@/lib/actions'
import { GlobeAltIcon, TableCellsIcon, UserIcon } from '@heroicons/react/16/solid'
import { Button } from '@/components/ui/button'
import { PlugsConnected } from '@phosphor-icons/react/dist/ssr'

export default async function Page({ params }: { params: { id: string } }) {

  const data: Connection | null = await fetchConnectionById(params.id)

  return (
    <div className="grid divide-y max-w-5xl mx-auto">
      <div className="p-10 grid grid-flow-col">
        <h2 className="text-4xl font-bold">
          {data?.databaseName}
        </h2>
        <div className="grid grid-flow-col gap-2">
          <Button size={'lg'} variant={'default'}>
            Query database
          </Button>
          <Button size={'lg'} variant={'ghost'} className='text-red-500 hover:text-red-500 border border-red-500/70'>
            Remove connection
          </Button>
        </div>
      </div>
      <div className='p-8 grid gap-4'>
        <h5 className="text-xl font-semibold">Credentials</h5>
        <section className="grid grid-flow-row[&>*:nth-child(even)]:bg-background [&>*:nth-child(odd)]:bg-primary-foreground">
          <div className="p-2 px-3 flex gap-2 items-center rounded-sm">
            <TableCellsIcon className='size-5' />
            <span className='flex items-center'>
              <p className="w-20 text-muted-foreground text-sm">Schema</p><p className="font-mono tracking-tighter">{data?.databaseName}</p>
            </span>
          </div>
          <div className="p-2 px-3 flex gap-2 items-center rounded-sm">
            <GlobeAltIcon className='size-5' />
            <span className='flex items-center'>
              <p className="w-20 text-muted-foreground text-sm">Host</p><p className="font-mono tracking-tighter">{data?.hostname}</p>
            </span>
          </div>
          <div className="p-2 px-3 flex gap-2 items-center rounded-sm">
            <PlugsConnected className='size-5' weight='fill' />
            <span className='flex items-center'>
              <p className="w-20 text-muted-foreground text-sm">Port</p><p className="font-mono tracking-tighter">{data?.port}</p>
            </span>
          </div>
          <div className="p-2 px-3 flex gap-2 items-center rounded-sm">
            <UserIcon className='size-5' />
            <span className='flex items-center'>
              <p className="w-20 text-muted-foreground text-sm">Username</p><p className="font-mono tracking-tighter">{data?.username}</p>
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}
