import "./globals.css";
import localFont from "next/font/local";

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { SessionProvider } from "next-auth/react"
import { TooltipProvider } from "@/components/ui/tooltip";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";


const sans = localFont({
  // src: "./fonts/InterTight-VariableFont_wght.ttf",
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});


export const metadata: Metadata = {
  title: "Dbex",
  description: "Database Explorer and Studio",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${geistMono.variable} scroll-smooth antialiased font-sans tracking-[-0.01em] text-muted-foreground`}>
        <Analytics/>
        <SpeedInsights/>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
            <TooltipProvider>
              <Toaster richColors={true} expand={true} />
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}