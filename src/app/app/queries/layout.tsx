import { cookies } from "next/headers"

import QueryTool from '@/components/tools/querytool'
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';
import { QueryListView } from "@/components/query-list-view";
import { QueryToolSettingsProvider } from "@/lib/hooks/querytoolsettings";

const QueryPage = () => {

  const layout = cookies().get("react-resizable-panels:layout")
  const defaultLayout = layout ? JSON.parse(layout.value) : [15, 25, 65]

  return (
    <>
      <ResizablePanel
        defaultSize={defaultLayout[1]}
        minSize={20}
        maxSize={25}
        className="bg-background rounded-l-xl border border-r-0"
      >
        <QueryListView />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={defaultLayout[2]} className="bg-background rounded-r-xl border border-l-0">
        <QueryToolSettingsProvider>
          <QueryTool />
        </QueryToolSettingsProvider>
      </ResizablePanel>
    </>
  )
}

export default QueryPage