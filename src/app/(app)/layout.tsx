
"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import HelpBot from "@/components/help-bot";
import { BottomNavBar } from "@/components/bottom-nav-bar";
import { MainSidebar } from "@/components/main-sidebar";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <div className={cn("grid min-h-screen w-full transition-[grid-template-columns] duration-300 ease-in-out", 
      isSidebarOpen ? "md:grid-cols-[240px_1fr]" : "md:grid-cols-[0px_1fr]")}>
      <div className={cn("hidden border-r bg-card md:block transition-all duration-300", isSidebarOpen ? "w-[240px]" : "w-0")}>
        <MainSidebar />
      </div>
      <div className="flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 sticky top-0 z-30">
            <AppHeader onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 pb-24 md:pb-6">
           <AnimatePresence mode="wait">
             <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
             >
                {children}
              </motion.div>
           </AnimatePresence>
        </main>
        
         <div className="fixed bottom-20 right-4 z-50">
           <HelpBot />
        </div>
        
        <div className="md:hidden">
          <BottomNavBar />
        </div>
      </div>
    </div>
  );
}
