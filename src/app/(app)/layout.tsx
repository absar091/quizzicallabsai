
"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NotificationHandler from "@/components/notification-handler";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import HelpBot from "@/components/help-bot";
import { BottomNavBar } from "@/components/bottom-nav-bar";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
      <div className="flex min-h-screen flex-col">
        <NotificationHandler />
        <AppHeader />

        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
            <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.div>
            </AnimatePresence>
        </main>
        
        <div className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6">
          <HelpBot />
        </div>

        <BottomNavBar />
      </div>
  );
}
