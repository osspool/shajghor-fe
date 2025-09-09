import { cookies } from "next/headers";

import { AppSidebar } from "@/components/custom/dashboard/app-sidebar";
import {
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { auth } from "../(auth)/auth";
import { notFound } from "next/navigation";

export default async function Layout({ children }) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  if (!session?.roles?.includes("superadmin")) {
    notFound();
  }

  return (
    <SidebarProvider>
      <AppSidebar admin={true} user={session?.user} />
      <SidebarInset className="">
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 px-4">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
