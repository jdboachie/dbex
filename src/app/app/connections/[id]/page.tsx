import Link from 'next/link'
import LoadingUI from '@/components/loading-ui'
import { Button } from '@/components/ui/button'
import { Connection } from '@prisma/client'
import { fetchConnectionById } from '@/lib/actions'
import { GlobeIcon, DatabaseIcon, UserIcon, ConnectionIcon, PlayFillIcon } from '@/components/icons'


export default async function Page({ params }: { params: { id: string } }) {

  const data: Connection | null = await fetchConnectionById(params.id)

  return (
    data ? (
      <div className="flex flex-col divide-y w-full">
        <div className="h-[125px] flex justify-between items-center px-10">
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
      </div>
    ) : (
      <LoadingUI />
    )
  )
}
