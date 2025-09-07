
"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { BottomNavBar } from "@/components/bottom-nav-bar";
import { MainSidebar } from "@/components/main-sidebar";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import ShareAppFAB from "@/components/share-app-fab";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const handleSidebarNavigate = () => {
    // Auto-close sidebar after navigation
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Show loading spinner only while actually loading
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not loading but no user, redirect (handled by useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Desktop Sidebar */}
      <div className={cn("hidden border-r bg-card md:block fixed left-0 top-0 h-full z-40 transition-all duration-300", isSidebarOpen ? "w-[240px]" : "w-[60px]")}>
        <MainSidebar onNavigate={handleSidebarNavigate} isCollapsed={!isSidebarOpen} />
      </div>

      <div className={cn("flex flex-col transition-all duration-300 min-h-screen", isSidebarOpen ? "md:ml-[240px]" : "md:ml-[60px]")}>
        <header className="flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 sticky top-0 z-30">
            <AppHeader onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 pb-24 md:pb-6 min-h-0 overflow-y-auto">
           <AnimatePresence mode="wait">
             <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
             >
                {children}
              </motion.div>
           </AnimatePresence>
        </main>

        <div className="md:hidden">
          <BottomNavBar />
        </div>

        <ShareAppFAB />
      </div>
    </div>
  );
}
