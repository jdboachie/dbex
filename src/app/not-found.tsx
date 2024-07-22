import { CompassIcon } from "@/components/icons"
import EmptyState from "@/components/closet/empty-state"

export default function NotFoundUI () {
  return (
    <div className="size-full h-screen p-10">
      <EmptyState
        icon={CompassIcon}
        title={'404'}
        description={'This page does not exist'}
        />
    </div>
  )
}