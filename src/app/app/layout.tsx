import { auth } from "@/auth";
import { cookies } from "next/headers"
import { SignIn } from "@/components/auth/server";
import MainNav from "@/components/layout/main-nav";
import AppLayout from "@/components/layout/app-layout";
import { ResizableHandle } from "@/components/ui/resizable";

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
      <>
        <p>You are not authorized to access this page</p>
        <p className="">{session}</p>
        <SignIn />
      </>
    )
  } else {
    return (
      <main className="h-screen size-full">
        <AppLayout>
        <MainNav
          defaultCollapsed={defaultCollapsed}
          defaultSize={defaultLayout[0]}
        />
          <ResizableHandle withHandle />
          {children}
        </AppLayout>
      </main>
    );
  }
}
