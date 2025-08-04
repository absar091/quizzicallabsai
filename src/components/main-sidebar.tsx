
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


const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/genlab", label: "GenLab", icon: FlaskConical },
  { href: "/exam-prep", label: "Exam Prep", icon: GraduationCap },
  { href: "/my-stats", label: "My Stats", icon: BarChart2 },
  { href: "/achievements", label: "Achievements", icon: Trophy },
];

const supportLinks = [
    { href: "/how-to-use", label: "How to Use", icon: HelpCircle },
    { href: "/profile", label: "Profile", icon: User },
]

type MainSidebarProps = {
  onNavigate?: () => void;
}

export function MainSidebar({ onNavigate }: MainSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const NavLink = ({ href, label, icon: Icon }: { href: string, label: string, icon: React.ElementType }) => {
    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
    return (
      <Link 
          href={href} 
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-4 rounded-lg px-4 py-2.5 text-foreground/70 transition-all hover:bg-primary/5 hover:text-primary",
            isActive && "bg-primary/10 text-primary font-semibold"
      )}>
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Link>
    )
  }
  
  return (
    <div className="flex flex-col h-full">
       <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-base font-medium">
          {mainNav.map(item => <NavLink key={item.href} {...item} />)}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <nav className="grid items-start px-4 text-base font-medium">
          {supportLinks.map(item => <NavLink key={item.href} {...item} />)}
          
          <AlertDialog>
              <AlertDialogTrigger asChild>
                  <button className="flex items-center gap-4 rounded-lg px-4 py-2.5 text-foreground/70 transition-all hover:bg-primary/5 hover:text-primary text-left">
                      <LogOut className="h-5 w-5" /> 
                      <span>Logout</span>
                  </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                      <AlertDialogDescription>
                          You will be returned to the login page.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                        logout();
                        if (onNavigate) onNavigate();
                      }}>Logout</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
        </nav>
      </div>
    </div>
  )
}
