
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FileUp,
  GraduationCap,
  LogOut,
  User,
  BotMessageSquare,
  BookOpen,
  ClipboardSignature,
  HelpCircle,
  BookMarked,
  BrainCircuit,
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
import { Button } from "./ui/button";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bookmarks", label: "Bookmarks", icon: BookMarked },
];

const generationTools = [
    { href: "/generate-quiz", label: "Custom Quiz", icon: BotMessageSquare },
    { href: "/generate-questions", label: "Practice Questions", icon: BookOpen },
    { href: "/generate-from-document", label: "Quiz from Document", icon: FileUp },
    { href: "/generate-study-guide", label: "Study Guide", icon: FileText },
    { href: "/generate-paper", label: "Generate Paper", icon: ClipboardSignature },
];

const examPrep = [
    { href: "/mdcat", label: "MDCAT Prep", icon: GraduationCap },
    { href: "/ecat", label: "ECAT Prep", icon: GraduationCap },
    { href: "/nts", label: "NTS Prep", icon: GraduationCap },
]

const supportLinks = [
    { href: "/how-to-use", label: "How to Use", icon: HelpCircle },
    { href: "/profile", label: "Profile", icon: User },
]

type MainSidebarProps = {
  onNavigate?: () => void;
  isMobile?: boolean;
}

export function MainSidebar({ onNavigate, isMobile }: MainSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const NavLink = ({ href, label, icon: Icon }: { href: string, label: string, icon: React.ElementType }) => {
    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
    return (
      <Link 
          href={href} 
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-4 rounded-lg px-4 py-2.5 text-foreground/70 transition-all hover:text-primary",
            isActive && "bg-primary/10 text-primary font-semibold"
      )}>
        <Icon className="h-5 w-5" />
        {label}
      </Link>
    )
  }
  
  if (!isMobile) return null;

  return (
    <>
       <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-base font-medium">
          <h3 className="px-4 py-2 text-sm font-semibold text-muted-foreground/70 tracking-wider">Main</h3>
          {mainNav.map(item => <NavLink key={item.href} {...item} />)}
          
          <h3 className="px-4 py-2 mt-4 text-sm font-semibold text-muted-foreground/70 tracking-wider">Generation Tools</h3>
          {generationTools.map(item => <NavLink key={item.href} {...item} />)}

          <h3 className="px-4 py-2 mt-4 text-sm font-semibold text-muted-foreground/70 tracking-wider">Exam Prep</h3>
          {examPrep.map(item => <NavLink key={item.href} {...item} />)}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <nav className="grid items-start px-4 text-base font-medium">
          {supportLinks.map(item => <NavLink key={item.href} {...item} />)}
          
          <AlertDialog>
              <AlertDialogTrigger asChild>
                  <button className="flex items-center gap-4 rounded-lg px-4 py-2.5 text-foreground/70 transition-all hover:text-primary text-left">
                      <LogOut className="h-5 w-5" /> Logout
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
    </>
  )
}

    