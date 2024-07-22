'use client' // Error components must be Client Components

import EmptyState from '@/components/closet/empty-state'
import { ZeroConfigIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="p-8 h-full">
      <EmptyState
        isError
        title={'Something went wrong'}
        description={error.message}
        icon={ZeroConfigIcon}
        className='text-red-500 border-red-500'
        >
        <Button variant={'destructive'} onClick={() => reset()}>
          Reset
        </Button>
      </EmptyState>
    </div>
  )
}