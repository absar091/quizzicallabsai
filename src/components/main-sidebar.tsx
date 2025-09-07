
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Flask,
  Exam,
  User,
  Star,
  Trophy
} from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { BrainCircuit, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePlan } from "@/hooks/usePlan";
import { useState, useEffect } from "react";
import { getQuizResults, getBookmarks } from "@/lib/indexed-db";


const mainNav = [
  { href: "/", label: "Home", icon: House },
  { href: "/genlab", label: "GenLab", icon: Flask },
  { href: "/exam-prep", label: "Exam Prep", icon: Exam },
  { href: "/profile", label: "Profile", icon: User },
];


type MainSidebarProps = {
  onNavigate?: () => void;
  isCollapsed?: boolean;
}

export function MainSidebar({ onNavigate, isCollapsed = false }: MainSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { plan } = usePlan();
  const [stats, setStats] = useState({ totalQuizzes: 0 });

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      try {
        const results = await getQuizResults(user.uid);
        setStats({ 
          totalQuizzes: results.length
        });
      } catch (error) {
        console.error('Error loading sidebar stats:', error);
      }
    }
    loadStats();
  }, [user]);

  const NavLink = ({ href, label, icon: Icon }: { href: string, label: string, icon: React.ElementType }) => {
    const isActive = pathname === href;
    return (
      <Link
          href={href}
          onClick={onNavigate}
          className={cn(
            "flex items-center rounded-lg px-4 py-3 text-muted-foreground transition-all hover:bg-secondary hover:text-primary",
            isCollapsed ? "gap-0 justify-center" : "gap-4",
            isActive && "bg-secondary text-primary font-semibold"
      )}
      title={isCollapsed ? label : undefined}>
        <Icon weight={isActive ? 'fill' : 'regular'} className={cn(isCollapsed ? "h-8 w-8" : "h-6 w-6")} />
        {!isCollapsed && <span className="text-base">{label}</span>}
      </Link>
    )
  }
  
  return (
    <div className="flex flex-col h-full bg-card">
       <div className="flex items-center p-4 h-16 lg:h-[64px]">
          <Link href="/" className={cn("flex items-center font-semibold text-lg", isCollapsed ? "gap-0 justify-center" : "gap-2")}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BrainCircuit className="h-5 w-5" />
              </div>
              {!isCollapsed && <span>Quizzicallabs</span>}
          </Link>
       </div>
       
       {/* User Info Section */}
       {user && !isCollapsed && (
         <div className="px-4 pb-4">
           <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
             <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
               {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium truncate">{user.displayName}</p>
               <div className="flex items-center gap-1">
                 <Badge variant={plan === 'Pro' ? 'default' : 'secondary'} className="text-xs px-2 py-0">
                   {plan === 'Pro' && <Sparkles className="h-2 w-2 mr-1" />}
                   {plan}
                 </Badge>
               </div>
             </div>
           </div>
         </div>
       )}
       
       <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium gap-1">
          {mainNav.map(item => (
            <div key={item.href} className="relative">
              <NavLink {...item} />

            </div>
          ))}
        </nav>
        
        {/* Quick Stats */}
        {user && stats.totalQuizzes > 0 && !isCollapsed && (
          <div className="px-4 mt-6">
            <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">QUICK STATS</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
                <Trophy className="h-3 w-3" />
                <span>{stats.totalQuizzes} Quizzes Taken</span>
              </div>

            </div>
          </div>
        )}
      </div>
      

    </div>
  )
}
