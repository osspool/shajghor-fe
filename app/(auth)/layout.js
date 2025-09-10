import { Navbar } from "@/components/custom/nav/navbar";
import Footer from "@/components/custom/ui/Footer";

export default async function RootLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="flex items-center justify-center">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
