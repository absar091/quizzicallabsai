
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

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    console.log('Protected Layout - Loading:', loading, 'User:', !!user);
    if (!loading && !user) {
      console.log('Redirecting to login');
      router.replace("/login");
    }
  }, [user, loading, router]);

  console.log('Protected Layout Render - Loading:', loading, 'User exists:', !!user);

  // Only show loading if actually loading AND no user
  if (loading && !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user and not loading, redirect
  if (!user && !loading) {
    router.replace("/login");
    return null;
  }

  // If we have a user, show the app
  if (user) {
    console.log('Rendering app for user:', user.email);
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
        
        <div className="md:hidden">
          <BottomNavBar />
        </div>
      </div>
    </div>
  );
}
