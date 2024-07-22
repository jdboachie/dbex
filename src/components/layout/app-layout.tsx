'use client'
import { usePathname } from "next/navigation";
import { ConnectionsListView } from "../connection-list-view";
import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { QueryListView } from "../query-list-view";

export default function AppLayout({
  children, layout
}: {
  children: React.ReactNode,
  layout: number[]
}) {

  const pathname = usePathname()

  return (
    <>
      <ResizablePanel
        defaultSize={layout[1]}
        minSize={15}
        maxSize={25}
        className="h-full rounded-l-lg bg-background border border-r-0"
      >
        {pathname.startsWith('/app/queries') && <QueryListView />}
        {pathname.startsWith('/app/connections') && <ConnectionsListView />}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        defaultSize={layout[2]}
        className="h-full bg-background rounded-r-lg border border-l-0"
      >
        { children }
      </ResizablePanel>
    </>
  );
}
