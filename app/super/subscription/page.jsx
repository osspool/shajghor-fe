import { auth } from "@/app/(auth)/auth";
import { PageHeader } from "@/components/custom/dashboard/page-header";
import { SubscriptionUI } from "./subscription-ui";

export default async function AdminSubscriptionPage() {
  const session = await auth();
  const accessToken = session?.accessToken || "";

  const breadcrumbItems = [
    { label: "Dashboard", href: "/super" },
    { label: "Admin", current: true },
    { label: "Subscriptions", current: true },
  ];

  return (
    <div className="flex flex-1 flex-col gap-2">
      <PageHeader items={breadcrumbItems} />
      <div className="flex-1">
        <SubscriptionUI token={accessToken} />
      </div>
    </div>
  );
}
