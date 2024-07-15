import { fetchQuerybyId } from '@/lib/actions'
import { Skeleton } from '@/components/ui/skeleton'
import QueryTool from '@/components/tools/querytool'

async function Page({params}: {params: {id: string}}) {

  const queryObject = await fetchQuerybyId(params.id)

  return (
    <>
      {queryObject ?
        <QueryTool queryObject={queryObject} />
        :
        <Skeleton className={`size-full`} />
      }
    </>
  )
}

export default Page