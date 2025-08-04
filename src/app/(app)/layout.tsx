
"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { BottomNavBar } from "@/components/bottom-nav-bar";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NotificationHandler from "@/components/notification-handler";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageCircle } from "lucide-react";
import HelpBot from "@/components/help-bot";
import { Button } from "@/components/ui/button";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isHelpBotOpen, setIsHelpBotOpen] = useState(false);

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
        <main className="flex-1 p-4 md:p-6 lg:p-8 container pb-24">
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
        <BottomNavBar />

         <div className="fixed bottom-20 right-4 z-50 md:hidden">
            <Button
                size="icon"
                className="rounded-full h-14 w-14 shadow-lg"
                onClick={() => setIsHelpBotOpen(true)}
                aria-label="Open AI Help Assistant"
            >
                <MessageCircle className="h-7 w-7" />
            </Button>
        </div>
        <HelpBot isOpen={isHelpBotOpen} onOpenChange={setIsHelpBotOpen} />
      </div>
  );
}
