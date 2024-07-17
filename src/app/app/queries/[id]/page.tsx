import { fetchQuerybyId } from '@/lib/actions'
import QueryTool from '@/components/tools/querytool'
import { Skeleton } from '@/components/ui/skeleton'
import EmptyState from '@/components/closet/empty-state'
import { ZeroConfigIcon } from '@/components/icons'

async function Page({params}: {params: {id: string}}) {

  const data = await fetchQuerybyId(params.id)

  return (
    data ?
      <QueryTool
        data={data}
      />
      :
      <EmptyState
        icon={ZeroConfigIcon}
        title={'404'}
        description={'This query does not exist'}
      />
      // <Skeleton className='size-full' />
  )
}

export default Page