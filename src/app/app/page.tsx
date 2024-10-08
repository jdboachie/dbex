'use server'

import EmptyState from "@/components/closet/empty-state"
import { ZeroConfigIcon } from "@/components/icons"

export default async function page () {
  return (
    <div className="max-w-6xl size-full">
      <EmptyState
        icon={ZeroConfigIcon}
        title={'Nothing to see here'}
        description={'Not what you were looking for? Pick a tab on the left'}
        />
    </div>
  )
}