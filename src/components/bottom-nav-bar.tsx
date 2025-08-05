
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FlaskConical, GraduationCap, Layers, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "./ui/avatar";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/genlab", label: "GenLab", icon: FlaskConical },
  { href: "/exam-prep", label: "Exam Prep", icon: GraduationCap },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNavBar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="fixed bottom-0 left-0 z-40 w-full h-16 bg-background border-t">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const isProfile = item.label === "Profile";
          return (
            <Link key={item.href} href={item.href} className="inline-flex flex-col items-center justify-center px-5 hover:bg-muted group relative">
              
              {isProfile && user ? (
                 <Avatar className={cn("h-6 w-6 mb-1 border-2", isActive ? "border-primary" : "border-transparent")}>
                   <AvatarFallback className="text-xs bg-muted">{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                 </Avatar>
              ) : (
                <item.icon className={cn(
                  "w-6 h-6 mb-1 text-muted-foreground group-hover:text-primary",
                  isActive && "text-primary"
                )} />
              )}
              
              <span className={cn(
                "text-xs text-muted-foreground group-hover:text-primary",
                isActive && "text-primary font-semibold"
              )}>
                {item.label}
              </span>

              {isActive && (
                <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute top-0 h-1 w-10 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
            )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

    