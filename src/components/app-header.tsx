
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const publicNavItems = [
  { href: "#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#contact", label: "Contact" },
]

export function AppHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isHomePage = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BrainCircuit className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold sm:inline-block">Quizzicallabs</span>
          </Link>
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
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-4">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1662120455989-5a433cec9980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxRVUlafGVufDB8fHx8MTc1MzM3NjU3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt={user?.displayName ?? ""}
                      data-ai-hint="user avatar"
                    />
                    <AvatarFallback>
                      {user?.displayName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
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
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
           <div className="md:hidden">
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><Menu/></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      {isHomePage && publicNavItems.map(item => (
                          <DropdownMenuItem key={item.label} asChild>
                              <Link href={item.href}>{item.label}</Link>
                          </DropdownMenuItem>
                      ))}
                      {!user && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild><Link href="/login">Log In</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link href="/signup">Sign Up</Link></DropdownMenuItem>
                        </>
                      )}
                  </DropdownMenuContent>
              </DropdownMenu>
           </div>
        </div>
      </div>
    </header>
  );
}
