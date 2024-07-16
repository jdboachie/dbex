'use client';

import { Button } from '@/components/ui/button'
import { deleteConnection } from '@/lib/actions'
import { useRouter } from 'next/navigation';

function DeleteConnection({connectionId} : {connectionId: string}) {
  const router = useRouter()

  return (
    <Button
      size={'lg'}
      variant={'outline'}
      className='text-red-500 hover:text-red-500'
      onClick={() => {deleteConnection(connectionId).then(() => router.push('/app/connections'))}}
    >
      Remove connection
    </Button>
  )
}

export default DeleteConnection