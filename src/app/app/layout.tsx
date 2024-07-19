import { auth } from "@/auth";
import { cookies } from "next/headers"
import { SignIn } from "@/components/auth/server";
import MainNav from "@/components/layout/main-nav";
import AppLayout from "@/components/layout/app-layout";
import { ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable";


export default async function Home({
  children,
}: {
  children: React.ReactNode;
}) {

  const layout = cookies().get("react-resizable-panels:layout")
  const collapsed = cookies().get("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout.value) : [15, 25, 65]
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : false

  const session = await auth()

   if ( !session ) {
    return (
       <div className='grid size-full h-screen place-items-center gap-4'>
        <div className="gap-2 grid grid-flow-row h-fit">
          <p>You are not authorized to access this page</p>
          <SignIn />
         </div>
       </div>
     )
   } else {
    return (
      <main className="h-screen w-screen overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="p-2 pl-0">
          <MainNav
            defaultCollapsed={defaultCollapsed}
            defaultSize={defaultLayout[0]}
          />
          <ResizableHandle className='bg-transparent' />
          <AppLayout layout={defaultLayout}>
            {children}
          </AppLayout>
        </ResizablePanelGroup>
      </main>
    );
  }
}
