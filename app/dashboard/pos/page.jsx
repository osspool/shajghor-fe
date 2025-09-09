// app/dashboard/sales/pos/page.jsx
import { auth } from "@/app/(auth)/auth";
import { PageHeader } from "@/components/custom/dashboard/page-header";
import { Suspense } from "react";
import { PosUi } from "./components/pos-ui";
import { POSProvider } from "./context/POSContext";

export const dynamic = "force-dynamic"; // Force dynamic rendering to ensure fresh data

export default async function PosPage(props) {
  const session = await auth();

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Point of Sale", current: true },
  ];

  return (
    <div className="flex flex-col h-screen max-h-[98dvh] overflow-hidden">
      <PageHeader items={breadcrumbItems} />
      <div className="flex-1 min-h-0 overflow-hidden">
        <POSProvider>
          <PosUi token={session?.accessToken} />
        </POSProvider>
      </div>
    </div>
  );
}
