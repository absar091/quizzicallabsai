
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Menu, HelpCircle, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MainSidebar } from "./main-sidebar";
import { Badge } from "./ui/badge";
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

const publicNavItems = [
  { href: "#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#contact", label: "Contact" },
];

export function AppHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const isHomePage = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 md:gap-6">
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon"><Menu/></Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] p-0 flex flex-col">
                 <SheetHeader className="p-4 border-b">
                    <SheetTitle>Menu</SheetTitle>
                 </SheetHeader>
                 <MainSidebar isMobile={true} onNavigate={() => setMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BrainCircuit className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold sm:inline-block">Quizzicallabs™</span>
            <Badge variant="secondary">Beta</Badge>
          </Link>
          {isHomePage && (
              <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                 {publicNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                      {item.label}
                    </Link>
                  ))}
              </nav>
          )}
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
           <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">How to use</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>How to Use Quizzicallabs AI</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="text-left text-sm text-muted-foreground max-h-[60vh] overflow-y-auto pr-4">
                        <p className="mb-4">Welcome to your AI-powered learning partner! Here’s a quick guide to get you started:</p>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-foreground">🚀 Getting Started: The Dashboard</h3>
                                <p>Your central hub to see recent quiz activity, review bookmarked questions, and track your topic mastery and daily goals.</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-foreground">🛠️ Generation Tools</h3>
                                <p>Use the sidebar to navigate to our powerful generation tools:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li><b>Custom Quiz:</b> Create quizzes tailored to your exact needs—specify topic, difficulty, question types, and more.</li>
                                    <li><b>Practice Questions:</b> Generate a quick set of questions with answers and explanations for any topic.</li>
                                    <li><b>Quiz from Document:</b> Upload your study materials (PDF, DOCX) and let our AI create a quiz for you.</li>
                                    <li><b>Study Guide:</b> Get a comprehensive, AI-generated study guide with key concepts, analogies, and a self-quiz.</li>
                                    <li><b>Generate Paper:</b> A tool for teachers to create and download formatted test papers with custom headers and layouts.</li>
                                </ul>
                            </div>

                             <div>
                                <h3 className="font-semibold text-foreground">🎓 Exam Prep</h3>
                                 <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li><b>MDCAT Prep:</b> Access specialized, high-difficulty tests for medical entry exam preparation, chapter by chapter.</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-foreground">⚙️ Account & Settings</h3>
                                 <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li><b>Profile:</b> View your account details or delete your account.</li>
                                    <li><b>Theme Toggle:</b> Use the sun/moon icon in the header to switch between light and dark mode for comfortable viewing.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Got it!</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {!user && (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
