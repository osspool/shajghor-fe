// app/dashboard/page.jsx
import { auth } from "@/app/(auth)/auth";
import { PageHeader } from "@/components/custom/dashboard/page-header";
import { DashboardUi } from "./components/DashboardUi";

// Force dynamic rendering since we use auth() which requires headers
export const dynamic = 'force-dynamic';

export default async function DashboardPage(props) {
    const session = await auth();
    const accessToken = session?.accessToken;



    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "Seller Dashboard", current: true },
    ];

    return (
        <div className="space-y-6">
            <PageHeader items={breadcrumbItems} />
            <div className="container px-4 py-6">
                <DashboardUi />
            </div>
        </div>
    );
}
