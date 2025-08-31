
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Flask, Exam, User } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: House },
  { href: "/genlab", label: "GenLab", icon: Flask },
  { href: "/exam-prep", label: "Exam Prep", icon: Exam },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-40 w-full h-16 bg-card border-t shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="inline-flex flex-col items-center justify-center px-1 group relative">
              <div className="relative">
                <item.icon weight={isActive ? 'fill' : 'regular'} className={cn(
                  "w-7 h-7 mb-1 text-muted-foreground transition-colors",
                  isActive && "text-primary"
                )} />
              </div>
              <span className={cn(
                "text-xs text-muted-foreground text-center",
                isActive && "text-primary font-medium"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
