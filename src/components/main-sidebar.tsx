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
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const generationTools = [
    { href: "/generate-quiz", label: "Custom Quiz", icon: BotMessageSquare },
    { href: "/generate-questions", label: "Practice Questions", icon: BookOpen },
    { href: "/generate-from-document", label: "Quiz from Document", icon: FileUp },
    { href: "/generate-study-guide", label: "Study Guide", icon: FileText },
];

const examPrep = [
    { href: "/mdcat", label: "MDCAT Prep", icon: GraduationCap },
]

export function MainSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const NavLink = ({ href, label, icon: Icon }: { href: string, label: string, icon: React.ElementType }) => {
    const isActive = pathname.startsWith(href);
    return (
      <Link href={href} className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
          isActive && "bg-muted text-primary"
      )}>
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    )
  }

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BrainCircuit className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg">Quizzicallabs™</span>
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
           <nav className="grid gap-1">
             <NavLink href="/profile" label="Profile" icon={User} />
             <button onClick={logout} className="w-full">
                <span className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                )}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </span>
            </button>
           </nav>
        </div>
      </div>
    </div>
  );
}
