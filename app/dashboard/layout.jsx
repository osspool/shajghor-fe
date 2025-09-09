import { cookies } from "next/headers";

import { AppSidebar } from "@/components/custom/dashboard/app-sidebar";
import {
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { auth } from "../(auth)/auth";
import { notFound, redirect } from "next/navigation";
import { parlourApi } from "@/api/platform/parlour-api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { AdminTenantProvider } from "@/contexts/AdminTenantContext";

export default async function Layout({ children }) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  if (!session || !session?.user) {
    return redirect("/login");
  }

  console.log("session", session.user);

  try {
    const myParlour = await parlourApi.getByOwnerId({ ownerId: session?.user?.id, token: session?.accessToken });
    if (myParlour?.data?.length === 0) redirect("/dashboard/profile");
  } catch (error) {
    console.error("Error getting my parlour:", error);
    return notFound();
  }
  // Hydrate admin tenant data
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ['parlours', 'owner', session?.user?.id],
    queryFn: () => parlourApi.getByOwnerId({ ownerId: session?.user?.id, token: session?.accessToken }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminTenantProvider ownerId={session?.user?.id} accessToken={session?.accessToken}>
        <SidebarProvider className="">
          <AppSidebar user={session?.user} userRoles={session?.roles} />
          <SidebarInset className="">
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2 px-4">
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AdminTenantProvider>
    </HydrationBoundary>
  );
}
