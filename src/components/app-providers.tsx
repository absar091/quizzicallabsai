
"use client";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import CookieConsentBanner from "@/components/cookie-consent-banner";
import { SplashScreen } from "@/components/splash-screen";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <SplashScreen />
        {children}
        <Toaster />
        <CookieConsentBanner />
      </AuthProvider>
    </ThemeProvider>
  );
}
