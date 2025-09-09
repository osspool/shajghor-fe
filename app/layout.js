import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
// import "./globals.css";
import Providers from "@/components/providers/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["italic", "normal"],
  display: "swap",
});

export const metadata = {
  // metadataBase: new URL("https://www.wastesync.com"),
  title: "ShajGhor",
  description:
    "No. 1 ladies saloon , artist and parlour booking platform in Bangladesh",
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const LIGHT_THEME_COLOR = "hsl(0 0% 100%)";
// const DARK_THEME_COLOR = "hsl(240deg 10% 3.92%)";
// const THEME_COLOR_SCRIPT = `\
// (function() {
//   var html = document.documentElement;
//   var meta = document.querySelector('meta[name="theme-color"]');
//   if (!meta) {
//     meta = document.createElement('meta');
//     meta.setAttribute('name', 'theme-color');
//     document.head.appendChild(meta);
//   }
//   function updateThemeColor() {
//     var isDark = html.classList.contains('dark');
//     meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
//   }
//   var observer = new MutationObserver(updateThemeColor);
//   observer.observe(html, { attributes: true, attributeFilter: ['class'] });
//   updateThemeColor();
// })();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Use static light theme-color; keep dynamic script commented for future */}
        <meta name="theme-color" content={LIGHT_THEME_COLOR} />
        {/**
         * <script
         *   dangerouslySetInnerHTML={{ __html: THEME_COLOR_SCRIPT }}
         * />
         */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
