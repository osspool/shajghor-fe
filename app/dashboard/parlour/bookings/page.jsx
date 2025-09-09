import { auth } from "@/app/(auth)/auth";
import { BookingsClient } from "./BookingsClient";
import { PageHeader } from "@/components/custom/dashboard/page-header";

export default async function ParlourBookingsPage() {
  const session = await auth();
  const accessToken = session?.accessToken || "";

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Bookings", current: true },
  ];

  return (
    <div className="flex flex-1 flex-col gap-2">
      <PageHeader items={breadcrumbItems} />
      <div className="flex-1">
        <BookingsClient token={accessToken} />
      </div>
    </div>
  );
}
