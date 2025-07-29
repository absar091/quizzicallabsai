
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Menu, HelpCircle, Sun, Moon, User, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

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
import { Badge } from "./ui/badge";

const publicNavItems = [
  { href: "#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#contact", label: "Contact" },
];

const appNavItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/generate-quiz", label: "Custom Quiz" },
    { href: "/generate-questions", label: "Practice" },
    { href: "/generate-from-document", label: "From Document" },
    { href: "/generate-study-guide", label: "Study Guide" },
    { href: "/generate-paper", label: "Paper Generator" },
    { href: "/mdcat", label: "MDCAT Prep" },
    { href: "/ecat", label: "ECAT Prep" },
    { href: "/nts", label: "NTS Prep" },
]

export function AppHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const isHomePage = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 md:gap-6">
          {user && (
             <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon"><Menu/></Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[250px] p-0 flex flex-col">
                  <SheetHeader className="border-b p-4">
                    <SheetTitle>
                      <Link href="/dashboard" className="flex items-center gap-2 font-semibold" onClick={() => setMobileMenuOpen(false)}>
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                              <BrainCircuit className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <span className="text-lg">Quizzicallabs</span>
                      </Link>
                    </SheetTitle>
                    <SheetDescription className="sr-only">Mobile navigation menu</SheetDescription>
                  </SheetHeader>
                  <MainSidebar isMobile={true} onNavigate={() => setMobileMenuOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>
          )}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BrainCircuit className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold sm:inline-block">Quizzicallabs<sup className='font-serif'>ᴬᴵ</sup></span>
            <Badge variant="secondary">Beta</Badge>
          </Link>
          
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
            {user && (
                 <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
                     {appNavItems.map((item) => (
                        <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "transition-colors hover:text-foreground/80 text-foreground/60",
                             pathname.startsWith(item.href) && "text-foreground"
                        )}
                        >
                        {item.label}
                        </Link>
                    ))}
                </nav>
            )}

            {isHomePage && (
              <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                 {publicNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                      {item.label}
                    </Link>
                  ))}
              </nav>
            )}

            <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="icon">
                <Link href="/how-to-use">
                    <HelpCircle className="h-5 w-5" />
                    <span className="sr-only">How to use</span>
                </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                {user ? (
                   <div className="hidden md:flex">
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-9 w-9">
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
                    <Button asChild>
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </header>
  );
}
