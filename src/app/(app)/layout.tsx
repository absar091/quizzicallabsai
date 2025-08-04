
"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NotificationHandler from "@/components/notification-handler";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Menu } from "lucide-react";
import HelpBot from "@/components/help-bot";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/main-sidebar";
import Link from "next/link";
import { BrainCircuit } from 'lucide-react';


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
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <NotificationHandler />
        
        <Sidebar>
            <SidebarHeader>
                 <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <BrainCircuit className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">Quizzicallabs AI</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <MainSidebar isMobile={false}/>
            </SidebarContent>
        </Sidebar>
        
        <SidebarInset>
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                 <div className="container flex h-16 items-center">
                    <div className="flex items-center gap-2 md:hidden">
                        <SidebarTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu />
                            </Button>
                        </SidebarTrigger>
                    </div>
                     <div className="flex flex-1 items-center justify-end">
                       <AppHeader />
                    </div>
                 </div>
            </header>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
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
        </SidebarInset>
        

        <div className="fixed bottom-20 right-4 z-50">
          <HelpBot />
        </div>
      </div>
    </SidebarProvider>
  );
}
