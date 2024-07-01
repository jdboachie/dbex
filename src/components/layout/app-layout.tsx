'use client'
import { ResizablePanelGroup } from "@/components/ui/resizable";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode,
}) {

  return (
    <main className="h-screen size-full">
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes,
          )}`;
        }}
        className="grid size-full items-stretch"
      >
        {children}
      </ResizablePanelGroup>
    </main>
  );
}
