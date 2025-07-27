
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

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const NavLink = ({ href, label, icon: Icon }: { href: string, label: string, icon: React.ElementType }) => {
    const isActive = pathname.startsWith(href);
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

  const handleLogout = () => {
    if (onNavigate) onNavigate();
    logout();
  }
  
  return (
    <>
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
         <nav className="grid gap-1">
           <NavLink href="/profile" label="Profile" icon={User} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                 <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary p-0">
                    <span className={cn( "flex items-center gap-3 rounded-lg px-3 py-2 transition-all w-full" )}>
                      <LogOut className="h-4 w-4" />
                      Logout
                    </span>
                 </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You can always log back in. Your progress will be saved.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
         </nav>
      </div>
    </>
  )
}

export function MainSidebar({ onNavigate, isMobile }: MainSidebarProps) {
  
  if(isMobile) {
    return <SidebarContent onNavigate={onNavigate} />
  }

  return (
    <div className="hidden md:flex flex-col h-full bg-muted/40 w-[250px] border-r">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold" onClick={onNavigate}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BrainCircuit className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg">Quizzicallabs™</span>
        </Link>
      </div>
      <SidebarContent onNavigate={onNavigate} />
    </div>
  );
}
