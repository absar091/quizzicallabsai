
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
];

export function AppHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BrainCircuit className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden font-bold sm:inline-block">
              Quizzicallabs™
            </span>
             <Badge variant="outline" className="ml-2 text-xs">Beta</Badge>
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
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
        </div>
        
        <nav className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {user && (
                 <Link href="/profile">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="https://placehold.co/100x100.png" alt={user?.displayName ?? ""} data-ai-hint="user avatar" />
                      <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Link>
            )}
             <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetHeader>
                            <SheetTitle>
                                 <div className="flex items-center space-x-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                        <BrainCircuit className="h-5 w-5 text-primary-foreground" />
                                    </div>
                                    <span className="font-bold">
                                        Quizzicallabs™
                                    </span>
                                </div>
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="grid gap-6 text-lg font-medium mt-8">
                            {menuItems.map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "transition-colors hover:text-foreground/80",
                                        pathname === item.href ? "text-foreground" : "text-foreground/60"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                             <Link
                                href="/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "transition-colors hover:text-foreground/80",
                                    pathname === "/profile" ? "text-foreground" : "text-foreground/60"
                                )}
                            >
                                Profile
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
          </nav>
      </div>
    </header>
  );
}
