import { UserRole } from "@/api/user-data";
import { Navbar } from "@/components/custom/nav/navbar";
import Footer from "@/components/custom/ui/Footer";
import { ClientProviders } from "@/components/providers/ClientProvider";
import { cookies } from "next/headers";
import { auth } from "../(auth)/auth";

export default async function RootLayout({ children }) {
    const [session, cookieStore] = await Promise.all([auth(), cookies()]);
    // console.log("session", session);
    const isSeller = session?.roles?.includes(UserRole.SELLER);
    const isAdmin = session?.roles?.includes(
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN
    );

    const params = {
        page: 1,
        limit: 100,
    };

    return (
        <ClientProviders>
            <div className="flex flex-col min-h-screen">
                <Navbar
                    user={session?.user}
                    token={session?.accessToken}
                    isSeller={isSeller}
                    isAdmin={isAdmin}
                />
                <main className="flex-grow w-full">{children}</main>
                <Footer />
            </div>
        </ClientProviders>
    );
}
