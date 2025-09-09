// app/profile/my-orders/page.jsx
import { auth } from "@/app/(auth)/auth";
import { PageHeader } from "@/components/custom/dashboard/page-header";
import { Suspense } from "react";
import { ServicesUi } from "./components/services-ui";

// Force dynamic rendering since we use auth() which requires headers
export const dynamic = 'force-dynamic';

export default async function ServicesPage(props) {
  let accessToken = "";

  try {
    // Try to get the session, but don't fail if we can't
    const session = await auth();
    accessToken = session?.accessToken || "";
  } catch (error) {
    console.error("Error getting session:", error);
    // Continue with empty token, will use dummy data
  }

  // Parse and validate search params
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 15; // Set default limit to 15

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Services", current: true },
  ];

  return (
    <div className="flex flex-1 flex-col gap-2">
      <PageHeader items={breadcrumbItems} />
      <div className="flex-1">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-64">
              Loading services...
            </div>
          }
        >
          <ServicesUi
            token={accessToken}
            initialPage={page}
            initialLimit={limit}
          />
    
        </Suspense>
      </div>
    </div>
  );
}
