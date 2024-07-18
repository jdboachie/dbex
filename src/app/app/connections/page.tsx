import React from 'react'
import { LayoutIcon, ServerIcon } from '@/components/icons'
import EmptyState from '@/components/closet/empty-state'

const Page = () => {
  return (
    <div className='flex flex-col h-full'>
      <section className='flex h-fit border-b gap-4 p-4 py-3 items-center'>
        <ServerIcon className='size-4' />
        <h4 className='text-base font-medium'>Connections</h4>
      </section>
      <section className="p-8 grow h-full">
        <EmptyState
          icon={LayoutIcon}
          title={'Nothing to show'}
          description={'Select a connection or connect to one to get started'}
        />
      </section>
    </div>
  )
}

export default Page