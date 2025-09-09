import { AuthNavbar } from "@/components/custom/nav/AuthNavbar";
import Footer from "@/components/custom/ui/Footer";

export default async function RootLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthNavbar />
      <main className="flex-grow">
        <div className="flex mt-10 items-center justify-center">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
