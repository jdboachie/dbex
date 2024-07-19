'use server'

import { ServerIcon } from '@/components/icons'
import EmptyState from '@/components/closet/empty-state'

const Page = () => {
  return (
    <div className="p-8 size-full">
      <EmptyState
        icon={ServerIcon}
        title={'Nothing to show'}
        description={'Select a connection or connect to one to get started'}
      />
    </div>
  )
}

export default Page