"use client";

import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import TanstackProvider from "./react-query";
import { ThemeProvider } from "./theme-provider";

const Providers = ({ children }) => {
  return (
    <SessionProvider>
      <TanstackProvider>
        {/* Force light theme; keep props commented for future re-enable */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          // enableSystem
          // disableTransitionOnChange
          forcedTheme="light"
        >
          <Toaster position="top-center" />
          {children}
        </ThemeProvider>
      </TanstackProvider>
    </SessionProvider>
  );
};

export default Providers;
