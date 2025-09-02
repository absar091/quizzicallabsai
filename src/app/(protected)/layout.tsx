
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

  // DEBUG: Log every render
  console.log('🔍 PROTECTED LAYOUT RENDER:');
  console.log('- loading:', loading);
  console.log('- user:', user);
  console.log('- user email:', user?.email);

  useEffect(() => {
    console.log('🔄 PROTECTED LAYOUT EFFECT - loading:', loading, 'user:', !!user);
    if (!loading && !user) {
      console.log('🔄 REDIRECTING TO LOGIN');
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Show loading spinner only while actually loading
  if (loading) {
    console.log('⏳ SHOWING LOADING SPINNER');
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading: {loading ? 'true' : 'false'}</p>
          <p className="text-xs text-muted-foreground">User: {user ? 'exists' : 'null'}</p>
        </div>
      </div>
    );
  }

  // If not loading but no user, redirect (handled by useEffect)
  if (!user) {
    console.log('❌ NO USER - RETURNING NULL');
    return null;
  }

  console.log('✅ RENDERING APP FOR USER:', user.email);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
      <div className="hidden border-r bg-card md:block w-[240px]">
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
