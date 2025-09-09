import { auth } from "@/app/(auth)/auth";
import { PageHeader } from "@/components/custom/dashboard/page-header";
import { SubscriptionClient } from "./SubscriptionClient";

export default async function ParlourTransactionsPage() {
  const session = await auth();
  const accessToken = session?.accessToken || "";

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Subscriptions", current: true },
  ];

  return (
    <div className="flex flex-1 flex-col gap-2">
      <PageHeader items={breadcrumbItems} />
      <div className="flex-1">
        <SubscriptionClient token={accessToken} />
      </div>
    </div>
  );
}
