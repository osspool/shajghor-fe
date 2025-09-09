// app/profile/my-orders/page.jsx
// import { getUser } from "@/api/user-data";
import { auth } from "@/app/(auth)/auth";
import { PageHeader } from "@/components/custom/dashboard/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import SellerProfileClient from "./components/seller-profile-client";
import ProfileProvider from "./providers";

// Force dynamic rendering since we use auth() which requires headers
export const dynamic = 'force-dynamic';

export default async function ProfilePage(props) {
    const session = await auth();
    const user = session?.user;

    // let user = null;
    // try {
    //     const response = await getUser(session?.user?.email);
    //     user = response?.user
    // } catch (error) {
    //     console.error(error);
    // }

    if (!user) {
        return <div>User not found</div>;
    }

    // console.log(user);

    const breadcrumbItems = [
        { label: "Profile", href: "/profile" },
        { label: "My Profile", current: true },
    ];

    return (
        <ProfileProvider>
            <div>
                <PageHeader items={breadcrumbItems} />
                <div className="space-y-6 p-6">
                    <Suspense
                        fallback={
                            <div className="space-y-8">
                                <Skeleton className="h-[200px] w-full" />
                                <Skeleton className="h-[400px] w-full" />
                            </div>
                        }
                    >
                        <SellerProfileClient
                            initialData={user}
                            token={session?.accessToken}
                        />
                    </Suspense>
                </div>
            </div>
        </ProfileProvider>
    );
}
