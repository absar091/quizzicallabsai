
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import CookieConsentBanner from "@/components/cookie-consent-banner";
import { SplashScreen } from "@/components/splash-screen";
import InstallPwaPrompt from "./install-pwa-prompt";

const HelpBot = dynamic(() => import("./help-bot"), { ssr: false });

function AppContent({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster />
            <CookieConsentBanner />
            <InstallPwaPrompt />
        </>
    );
}

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  useEffect(() => {
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) {
      setIsSplashLoading(false);
    }
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        {isSplashLoading ? (
          <SplashScreen onAnimationComplete={() => setIsSplashLoading(false)} />
        ) : (
          <AppContent>{children}</AppContent>
        )}
      </AuthProvider>
    </ThemeProvider>
  );
}
