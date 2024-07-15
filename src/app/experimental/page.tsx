'use client'

import * as React from 'react'
import { Connection } from '@prisma/client/edge'
import { useSession } from 'next-auth/react'
import { experimentalFetchConnections } from "./actions"
import { fetchUserByEmail } from '@/lib/actions'
import ConnectionCardSkeleton from '@/components/closet/skeletons/ConnectionCardSkeleton'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { PostgresAltIcon } from '@/components/icons'
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu'


export default function Page () {

  const { data } = useSession()
  const [connections, setConnections] = React.useState<Connection[]>([])


  React.useEffect(() => {
    async function fetchConnections () {
      return await experimentalFetchConnections();
    }

    fetchConnections().then((res) => {setConnections(res)})
  }, [data?.user?.email])


  return (
    <div className={`p-10 h-screen`}>
      <div className="border rounded-xl p-4 bg-primary-foreground size-full">
        {connections ?
          <div className='relative grid grid-flow-row size-full gap-2'>
            {connections.map((connection) => (
              <Link
                key={connection.id}
                  href={`/app/connections/${connection.id}`}
                >
                <div className='border rounded-md p-4 h-fit flex gap-3 items-center justify-start'>
                  <PostgresAltIcon className="size-10"/>
                  <div className="grid grid-flow-row w-full gap-1 items-center justify-start">
                    <div className="items-center grid grid-cols-2">
                      <p className="text-start truncate text-sm">{connection.databaseName}</p>
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
                              // onClick={() => {handleDelete(connection)}}
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
          <ConnectionCardSkeleton />
        }
      </div>
    </div>
  )
}