
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FlaskConical,
  GraduationCap,
  LogOut,
  User,
  HelpCircle,
  BarChart2,
  Trophy,
  BrainCircuit,
  Settings
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/genlab", label: "GenLab", icon: FlaskConical },
  { href: "/exam-prep", label: "Exam Prep", icon: GraduationCap },
  { href: "/my-stats", label: "My Stats", icon: BarChart2 },
  { href: "/achievements", label: "Achievements", icon: Trophy },
];

const supportLinks = [
    { href: "/how-to-use", label: "How to Use", icon: HelpCircle },
]

type MainSidebarProps = {
  onNavigate?: () => void;
}

export function MainSidebar({ onNavigate }: MainSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const NavLink = ({ href, label, icon: Icon }: { href: string, label: string, icon: React.ElementType }) => {
    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
    return (
      <Link 
          href={href} 
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/80 transition-all hover:bg-secondary hover:text-primary",
            isActive && "bg-secondary text-primary font-semibold"
      )}>
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Link>
    )
  }
  
  return (
    <div className="flex flex-col h-full bg-card border-r">
       <div className="flex items-center border-b p-4 h-14 lg:h-[60px]">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BrainCircuit className="h-5 w-5" />
              </div>
              <span className="text-lg">Quizzicallabs AI</span>
          </Link>
       </div>
       <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium gap-1">
          {mainNav.map(item => <NavLink key={item.href} {...item} />)}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
         <nav className="grid items-start px-4 text-sm font-medium gap-1">
            {supportLinks.map(item => <NavLink key={item.href} {...item} />)}
         </nav>
         <Separator className="my-4"/>
         <div className="px-4">
            <Link href="/profile">
              <div className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                      <span className="text-sm font-semibold">{user?.displayName}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
              </div>
            </Link>
         </div>
      </div>
    </div>
  )
}
