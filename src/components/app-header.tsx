
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";


export function AppHeader() {
  const { user } = useAuth();
  
  if (!user) {
    return (
       <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
              <div className="flex-1" />
              <div className="flex items-center gap-2 sm:gap-4">
                  <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
                     <Link href="/#features" className="transition-colors hover:text-primary text-muted-foreground">Features</Link>
                     <Link href="/how-to-use" className="transition-colors hover:text-primary text-muted-foreground">Guides</Link>
                  </nav>
                  <Button asChild variant="ghost">
                      <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <Link href="/signup">Get Started Free</Link>
                  </Button>
              </div>
          </div>
      </header>
    )
  }

  // App Header for logged in users
  return (
    <div className="w-full flex-1 flex items-center justify-between">
        <div className="md:hidden">
            <h1 className="font-semibold text-lg">Quizzicallabs <sup className="text-xs text-primary -top-2 relative">AI</sup></h1>
        </div>
        <div className="hidden md:block">
            {/* The PageHeader component will now handle displaying the title on desktop */}
        </div>
         <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5"/>
                <span className="sr-only">Notifications</span>
            </Button>
         </div>
    </div>
  );
}
