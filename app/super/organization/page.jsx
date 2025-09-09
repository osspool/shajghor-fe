import { auth } from "@/app/(auth)/auth";
import { PageHeader } from "@/components/custom/dashboard/page-header";
import { Suspense } from "react";
import { OrganizationListUi } from "./components/organization-list-ui";

export const dynamic = 'force-dynamic';

export default async function OrganizationPage(props) {
  let accessToken = "";
  try {
    const session = await auth();
    accessToken = session?.accessToken || "";
  } catch {}

  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 15;

  const breadcrumbItems = [
    { label: "Super Admin", href: "/super" },
    { label: "Organizations", current: true },
  ];

  return (
    <div className="flex flex-1 flex-col gap-2">
      <PageHeader items={breadcrumbItems} />
      <div className="flex-1">
        <Suspense fallback={<div className="flex justify-center items-center h-64">Loading organizations...</div>}>
          <OrganizationListUi token={accessToken} initialPage={page} initialLimit={limit} />
        </Suspense>
      </div>
    </div>
  );
}


