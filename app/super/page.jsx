import { PageHeader } from "@/components/custom/dashboard/page-header";
import { auth } from "../(auth)/auth";
import { notFound } from "next/navigation";

// Force dynamic rendering since we use auth() which requires headers
export const dynamic = 'force-dynamic';


export default async function Page() {
  const [session] = await Promise.all([auth()]);
  if (!session && !session.roles.includes("admin")) {
    notFound()
  }

  const breadcrumbItems = [
    { label: "admin", href: "/super" },
    { label: "Summary", current: true },
  ];

  return (
    <div>
      <PageHeader items={breadcrumbItems} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        Hi Admin
      </div>
    </div>
  );
}
