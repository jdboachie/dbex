'use client'

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { QueryListView } from "../query-list-view";
import { ConnectionsListView } from "../connection-list-view";
import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable";


export default function AppLayout({
  children, layout
}: {
  children: React.ReactNode,
  layout: number[]
}) {

  const pathname = usePathname()

  return (
    <>
    {!pathname.startsWith('/app/home') &&
      <>
        <ResizablePanel
        defaultSize={layout[1]}
        minSize={17}
        maxSize={25}
        className="h-full rounded-l-lg bg-background border border-r-0"
        >
          {pathname.startsWith('/app/queries') && <QueryListView />}
          {pathname.startsWith('/app/connections') && <ConnectionsListView />}
        </ResizablePanel>
        <ResizableHandle />
      </>
    }
      <ResizablePanel
        defaultSize={!pathname.startsWith('app/home') ? layout[2] : layout[1] + layout[2]}
        className={cn("h-full bg-background rounded-r-lg border border-l-0", pathname.startsWith('/app/home') && 'border rounded-lg' )}
      >
        { children }
      </ResizablePanel>
    </>
  );
}
