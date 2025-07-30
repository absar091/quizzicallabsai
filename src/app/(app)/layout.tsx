
"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BrainCircuit } from "lucide-react";
import NotificationHandler from "@/components/notification-handler";
import { SplashScreen } from "@/components/splash-screen";
import { AnimatePresence, motion } from "framer-motion";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  return (
    <AnimatePresence mode="wait">
      {loading || !user ? (
        <motion.div key="splash">
          <SplashScreen />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex min-h-screen flex-col"
        >
          <NotificationHandler />
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 container">
            {children}
          </main>
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
