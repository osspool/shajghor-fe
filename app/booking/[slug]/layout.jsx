import { auth } from "@/app/(auth)/auth";
import Footer from "@/components/custom/ui/Footer";
import { BookingContextProvider } from "@/contexts/BookingContext";

export default async function ParlourLayout({ children }) {
  const session = await auth();
  return (
    <>
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
