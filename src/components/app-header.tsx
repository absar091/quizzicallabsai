
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, HelpCircle, Sun, Moon, User, LogOut, BrainCircuit, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MainSidebar } from "./main-sidebar";

const publicNavItems = [
  { href: "#features", label: "Features" },
  { href: "/how-to-use", label: "Guides" },
];

export function AppHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const isHomePage = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2" aria-label="Go to homepage">
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9, rotate: -15 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <BrainCircuit className="h-6 w-6" />
            </motion.div>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
            {isHomePage && (
              <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
                 {publicNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="transition-colors hover:text-primary text-muted-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
              </nav>
            )}

            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
                {!user && (
                    <div className="hidden items-center gap-2 md:flex">
                    <Button asChild variant="ghost">
                        <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">Get Started Free</Link>
                    </Button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </header>
  );
}
