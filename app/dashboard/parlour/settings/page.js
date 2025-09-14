// app/profile/my-orders/page.jsx
import { auth } from "@/app/(auth)/auth";
import { PageHeader } from "@/components/custom/dashboard/page-header";
import { Suspense } from "react";
import { ParlourSettingsUi } from "./components/parlour-settings-ui";

export default async function SettingsPage(props) {
  let accessToken = "";

  try {
    // Try to get the session, but don't fail if we can't
    const session = await auth();
    accessToken = session?.accessToken || "";
  } catch (error) {
    console.error("Error getting session:", error);
    // Continue with empty token, will use dummy data
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings", current: true },
  ];

  return (
    <div className="flex flex-1 flex-col gap-2">
      <PageHeader items={breadcrumbItems} />
      <div className="flex-1">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-64">
              Loading settings...
            </div>
          }
        >
          <ParlourSettingsUi />
        </Suspense>
      </div>
    </div>
  );
}
