
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Flask,
  Exam,
  User
} from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { BrainCircuit } from "lucide-react";

const mainNav = [
  { href: "/", label: "Home", icon: House },
  { href: "/genlab", label: "GenLab", icon: Flask },
  { href: "/exam-prep", label: "Exam Prep", icon: Exam },
  { href: "/profile", label: "Profile", icon: User },
];


type MainSidebarProps = {
  onNavigate?: () => void;
}

export function MainSidebar({ onNavigate }: MainSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const NavLink = ({ href, label, icon: Icon }: { href: string, label: string, icon: React.ElementType }) => {
    const isActive = pathname === href;
    return (
      <Link 
          href={href} 
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-4 rounded-lg px-4 py-3 text-muted-foreground transition-all hover:bg-secondary hover:text-primary",
            isActive && "bg-secondary text-primary font-semibold"
      )}>
        <Icon weight={isActive ? 'fill' : 'regular'} className="h-6 w-6" />
        <span className="text-base">{label}</span>
      </Link>
    )
  }
  
  return (
    <div className="flex flex-col h-full bg-card">
       <div className="flex items-center p-4 h-16 lg:h-[64px]">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BrainCircuit className="h-5 w-5" />
              </div>
              <span>Quizzicallabs</span>
          </Link>
       </div>
       <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-2 text-sm font-medium gap-1">
          {mainNav.map(item => <NavLink key={item.href} {...item} />)}
        </nav>
      </div>
    </div>
  )
}
