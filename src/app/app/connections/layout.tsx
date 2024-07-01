import { cookies } from "next/headers"
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';
import { ConnectionsListView } from '@/components/connection-list-view'

const Layout = ({ children }: {children: React.ReactNode}) => {

  const layout = cookies().get("react-resizable-panels:layout")
  const defaultLayout = layout ? JSON.parse(layout.value) : [15, 20, 65]

  return (
    <>
      <ResizablePanel
        defaultSize={defaultLayout[1]}
        minSize={20}
        maxSize={25}
      >
        <ConnectionsListView />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[2]} className="bg-background dark:bg-primary-foreground">
        { children }
      </ResizablePanel>
    </>
  )
}

export default Layout