import React from 'react'
import { ServerIcon } from '@/components/icons'

export default function Page ({ params }: { params: { id: string } }) {
  return (
    <div className='grid divide-y'>
      <section className='flex gap-4 p-4 py-3 items-center'>
        <ServerIcon className='size-5 text-primary/70' />
        <h4 className='text-lg'>Connections</h4>
      </section>
      <section className="p-4">
        connection id: {params.id}
      </section>
    </div>
  )
}
