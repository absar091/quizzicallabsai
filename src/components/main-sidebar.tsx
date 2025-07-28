
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BrainCircuit,
  LayoutDashboard,
  FileText,
  FileUp,
  GraduationCap,
  LogOut,
  User,
  BotMessageSquare,
  BookOpen,
  ClipboardSignature,
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
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
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            isActive && "bg-muted text-primary"
      )}>
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    )
  }
  
  if (!isMobile) return null; // Sidebar is only for mobile now

  return (
    <>
       <div className="flex h-16 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold" onClick={onNavigate}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <BrainCircuit className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg">Quizzicallabs</span>
            </Link>
       </div>
       <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground/70">Main</h3>
          {mainNav.map(item => <NavLink key={item.href} {...item} />)}
          
          <h3 className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground/70">Generation Tools</h3>
          {generationTools.map(item => <NavLink key={item.href} {...item} />)}

          <h3 className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground/70">Exam Prep</h3>
          {examPrep.map(item => <NavLink key={item.href} {...item} />)}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://images.unsplash.com/photo-1678931547963-ab9017fc35c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOHx8YnJhaW4lMjBhbmltaWV8ZW58MHx8fHwxNzUzNjE1NjAwfDA&ixlib=rb-4.1.0&q=80&w=1080" alt={user?.displayName ?? "User"} data-ai-hint="user avatar" />
            <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="text-sm font-semibold truncate">{user?.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <nav className="mt-4 flex flex-col gap-1">
          <Link href="/profile" onClick={onNavigate} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-sm", pathname === "/profile" && "bg-muted text-primary")}>
            <User className="h-4 w-4" /> Profile
          </Link>
          <AlertDialog>
              <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="justify-start px-3 py-2 text-muted-foreground text-sm font-normal">
                      <LogOut className="h-4 w-4 mr-3" /> Logout
                  </Button>
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
