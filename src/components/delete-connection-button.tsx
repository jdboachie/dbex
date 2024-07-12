'use client';

import { Button } from '@/components/ui/button'
import { deleteConnection } from '@/lib/actions'

function DeleteConnection({connectionId} : {connectionId: string}) {
  return (
    <Button
      size={'lg'}
      variant={'outline'}
      className='text-red-500 hover:text-red-500'
      onClick={() => {deleteConnection(connectionId)}}
    >
      Remove connection
    </Button>
  )
}

export default DeleteConnection