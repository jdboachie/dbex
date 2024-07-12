import React from 'react'
import { ServerStackIcon } from '@heroicons/react/16/solid'
import Link from 'next/link'


export default function Layout ({ children }: { children: React.ReactNode }) {

  return (
    <div className='size-full'>
      <section className='flex border-b gap-4 p-4 py-3 items-center'>
        <ServerStackIcon className='size-5 text-primary/70' />
        <Link href={'/app/connections'} className='text-lg'>Connections</Link>
      </section>
      {children}
    </div>
  )
}
