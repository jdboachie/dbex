'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'
import { deleteConnection } from '@/lib/actions'

function DeleteConnection({connectionId} : {connectionId: string}) {
  const router = useRouter()

  return (
    <Button
      size={'lg'}
      variant={'outline'}
      className='text-red-500 hover:text-red-500 border-destructive hover:bg-destructive/50'
      onClick={() => {deleteConnection(connectionId).then(() => router.push('/app/connections'))}}
    >
      Remove connection
    </Button>
  )
}

export default DeleteConnection