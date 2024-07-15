import { fetchQuerybyId } from '@/lib/actions'
import LoadingUI from '@/components/loading-ui'
import QueryTool from '@/components/tools/querytool'

async function Page({params}: {params: {id: string}}) {

  const queryObject = await fetchQuerybyId(params.id)

  return (
    <QueryTool queryObject={queryObject} />
  )
}

export default Page