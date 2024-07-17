import { fetchQuerybyId } from '@/lib/actions'
import QueryTool from '@/components/tools/querytool'

async function Page({params}: {params: {id: string}}) {

  const data = await fetchQuerybyId(params.id)

  return (
    data &&
      <QueryTool
        data={data}
      />
  )
}

export default Page