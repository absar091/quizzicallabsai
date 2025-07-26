
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Menu } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/mdcat", label: "Entry Test Prep" },
  { href: "/generate-quiz", label: "Custom Quiz" },
  { href: "/generate-questions", label: "Practice Questions" },
  { href: "/generate-from-document", label: "Quiz from Doc" },
  { href: "/generate-study-guide", label: "Study Guide" },
];

export function AppHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomePage = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Mobile Menu Trigger - only shows when logged in */}
        {user && (
           <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] p-4">
                <SheetHeader className="mb-8">
                  <SheetTitle>
                    <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <BrainCircuit className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span className="font-bold">Quizzicallabs™</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="grid gap-2 text-base font-medium">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        pathname === item.href && "bg-muted text-primary"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                 <div className="absolute bottom-4 left-4 right-4">
                     <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary border-t",
                           pathname === "/profile" && "bg-muted text-primary"
                        )}
                      >
                       Profile
                      </Link>
                 </div>
              </SheetContent>
            </Sheet>
          </div>
        )}

        {/* Desktop Logo and Nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BrainCircuit className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold sm:inline-block">Quizzicallabs™</span>
            <Badge variant="outline" className="text-xs">
              Beta
            </Badge>
          </Link>
          {!isHomePage && user && (
            <nav className="items-center gap-6 text-sm font-medium flex">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        
        {/* Centered Mobile Logo */}
         <div className={cn("flex-1 flex justify-center md:hidden", user && "mr-10")}>
             <Link href="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <BrainCircuit className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold sm:inline-block">Quizzicallabs™</span>
            </Link>
        </div>


        {/* Right Side Actions */}
        <div className="flex items-center justify-end gap-2 md:flex-1">
          <ThemeToggle />
          {user ? (
            <Link href="/profile" className="hidden md:block">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1662120455989-5a433cec9980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxRVUlafGVufDB8fHx8MTc1MzM3NjU3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt={user?.displayName ?? ""}
                  data-ai-hint="user avatar"
                />
                <AvatarFallback>
                  {user?.displayName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
