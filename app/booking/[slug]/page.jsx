
import { auth } from "@/app/(auth)/auth";
import { parlourApi } from "@/api/platform/parlour-api";
import { BookingContextProvider } from "@/contexts/BookingContext";
import { UserNav } from "@/components/custom/nav/user-nav";
import { ParlourPageClient } from "./components/ParlourPageClient";
import { notFound } from "next/navigation";

export default async function ParlourPublicPage({ params }) {
  const { slug } = await params;
  const session = await auth();
  const accessToken = session?.accessToken || "";

  // Fetch parlour server-side for SEO and pass to client
  let parlour = null;
  try {
    const parlourRes = await parlourApi.getBySlug({ slug, token: accessToken });
    parlour = parlourRes?.data ?? parlourRes ?? null;
  } catch (err) {
    return notFound();
  }
  if (!parlour || !parlour?._id) {
    return notFound();
  }

  console.log(session?.user)
  const resolvedParlourId = parlour?._id || parlour?.id || "";
  const resolvedOrgId = typeof parlour?.organizationId === 'string' ? parlour?.organizationId : (parlour?.organizationId?._id || "");

  const initialBooking = {
    organizationId: resolvedOrgId,
    parlourId: resolvedParlourId,
    serviceType: parlour?.serviceLocationMode || 'in-salon',
    parlourName: parlour?.name || '',
  };

  return (
    <BookingContextProvider session={session} initialBooking={initialBooking}>
      <div className="fixed top-4 right-4 z-50">
        <UserNav user={session?.user} isSeller={session?.roles?.includes('seller')} isAdmin={session?.roles?.includes('admin') || session?.roles?.includes('super_admin')} />
      </div>
      <ParlourPageClient slug={slug} initialParlour={parlour} />
    </BookingContextProvider>
  );
}
