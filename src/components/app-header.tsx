
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Menu } from "lucide-react";
import { X } from "lucide-react";
import { BrainCircuit } from "lucide-react";
import { ArrowLeft } from "lucide-react";
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

  // Pages where the main logo should be shown instead of a back button on mobile
  const topLevelAppPages = ["/dashboard", "/genlab", "/exam-prep", "/profile", "/bookmarks"];
  const isTopLevelAppPage = topLevelAppPages.includes(pathname);
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(pathname);
  const isLandingPage = pathname === '/';

  // Back button logic for logged-in users
  const showAppBackButton = user && !isTopLevelAppPage;

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
                  {!isAuthPage && !isLandingPage && <div className="md:hidden"/>}
                  {isLandingPage && (
                    <>
                    <Button asChild variant="ghost">
                      <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link href="/signup">Get Started Free</Link>
                    </Button>
                    </>
                  )}
              </div>
          </div>
      </header>
    )
  }

  // App Header for logged in users
  return (
    <div className="flex items-center gap-2 md:gap-4 w-full">
      {/* Mobile back button */}
      {showAppBackButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex-shrink-0 md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}

      {/* Desktop sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onSidebarToggle}
        aria-label="Toggle sidebar"
        className="flex-shrink-0 hidden md:inline-flex"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-between min-w-0">
        {/* Mobile logo (only on top-level pages) */}
        <div className="flex-1 md:hidden">
          {!showAppBackButton && (
            <Link href="/" className="font-semibold text-lg truncate block">
              Quizzicallabs<sup className="text-xs text-primary -top-2 relative">AI</sup>
            </Link>
          )}
        </div>

        {/* Spacer for mobile to push notifications to right */}
        <div className="flex-1"></div>

        {/* Notifications icon */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5"/>
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
