
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import CookieConsentBanner from "@/components/cookie-consent-banner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Quizzicallabs AI",
  description: "AI-Powered Quiz Generation and Learning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
            <CookieConsentBanner />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
