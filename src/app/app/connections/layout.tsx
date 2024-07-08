import { cookies } from "next/headers"
import { ConnectionsListView } from '@/components/connection-list-view'
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';

const Layout = ({ children }: {children: React.ReactNode}) => {

  const layout = cookies().get("react-resizable-panels:layout")
  const defaultLayout = layout ? JSON.parse(layout.value) : [15, 20, 65]

  return (
    <>
      <ResizablePanel
        defaultSize={defaultLayout[1]}
        minSize={20}
        maxSize={25}
        className="bg-background rounded-l-xl border border-r-0"
      >
        <ConnectionsListView />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={defaultLayout[2]} className="bg-background rounded-xl rounded-l-none border border-l-0">
        { children }
      </ResizablePanel>
    </>
  )
}

export default Layout