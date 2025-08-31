
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, Menu, X, BrainCircuit, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";

interface AppHeaderProps {
  onSidebarToggle?: () => void;
  isSidebarOpen?: boolean;
}

export function AppHeader({ onSidebarToggle, isSidebarOpen }: AppHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Pages where the back button should not be shown
  const noBackPages = ["/dashboard", "/genlab", "/exam-prep", "/profile"];
  const showBackButton = user && !noBackPages.includes(pathname);
  
  if (!user) {
    return (
       <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
              <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <BrainCircuit className="h-5 w-5" />
                  </div>
                  <span>Quizzicallabs<sup className="text-xs text-primary -top-2 relative">AI</sup></span>
              </Link>
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
    <>
      {showBackButton ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          onClick={onSidebarToggle}
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}
      <div className="w-full flex-1 flex items-center justify-between md:justify-end">
          <div className="md:hidden">
              <h1 className="font-semibold text-lg">Quizzicallabs<sup className="text-xs text-primary -top-2 relative">AI</sup></h1>
          </div>
           <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5"/>
                  <span className="sr-only">Notifications</span>
              </Button>
           </div>
      </div>
    </>
  );
}
