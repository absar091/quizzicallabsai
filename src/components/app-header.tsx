
"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function AppHeader() {
  const { user, logout } = useAuth();
  
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
                  <Button asChild>
                      <Link href="/signup">Get Started Free</Link>
                  </Button>
              </div>
          </div>
      </header>
    )
  }

  // App Header for logged in users
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/how-to-use">Support</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );
}
