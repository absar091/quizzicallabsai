
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, HelpCircle, Sun, Moon, User, LogOut, BrainCircuit } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const appNavItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/generate-quiz", label: "Custom Quiz" },
    { href: "/generate-questions", label: "Practice" },
    { href: "/mdcat", label: "MDCAT" },
    { href: "/ecat", label: "ECAT" },
    { href: "/nts", label: "NTS" },
    { href: "/generate-study-guide", label: "Study Guide" },
    { href: "/generate-paper", label: "Generate Paper" },
]

function NavLink({ href, label, currentPath }: { href: string; label: string; currentPath: string }) {
    const isActive = currentPath === href || (href !== '/' && href !== '/dashboard' && currentPath.startsWith(href));
    return (
        <Link
            href={href}
            className="relative px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
            {label}
            {isActive && (
                <motion.div
                    layoutId="active-nav-link"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
            )}
        </Link>
    );
}

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
          {user && (
             <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon"><Menu/></Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
                  <SheetHeader className="border-b p-4">
                    <SheetTitle>
                      <Link href="/dashboard" className="flex items-center gap-2 font-semibold" onClick={() => setMobileMenuOpen(false)}>
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                              <BrainCircuit className="h-6 w-6 text-primary-foreground" />
                          </div>
                          <span className="text-xl">Quizzicallabs</span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <MainSidebar isMobile={true} onNavigate={() => setMobileMenuOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>
          )}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9, rotate: -15 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <BrainCircuit className="h-8 w-8 text-primary" />
            </motion.div>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
            <AnimatePresence>
                {user && (
                     <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
                         {appNavItems.map((item) => (
                            <NavLink key={item.href} href={item.href} label={item.label} currentPath={pathname} />
                        ))}
                    </nav>
                )}
            </AnimatePresence>

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
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
                 <Link href="/how-to-use" className="hidden md:inline-flex">
                    <Button variant="ghost" size="icon">
                        <HelpCircle className="h-5 w-5" />
                        <span className="sr-only">Help and Guides</span>
                    </Button>
                </Link>
                {user ? (
                   <div className="hidden md:flex">
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                            </p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                        <Link href="/profile">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                        <Link href="/how-to-use">
                            <HelpCircle className="mr-2 h-4 w-4" />
                            <span>How to Use</span>
                        </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => logout()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                   </div>
                ) : (
                    <div className="hidden items-center gap-2 md:flex">
                    <Button asChild variant="ghost">
                        <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link href="/signup">Create your quiz - it's free</Link>
                    </Button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </header>
  );
}

    