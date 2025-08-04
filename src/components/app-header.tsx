
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, BrainCircuit, User, FlaskConical, GraduationCap, BarChart2, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import React from "react";


const genLabComponents: { title: string; href: string; description: string }[] = [
  {
    title: "Custom Quiz",
    href: "/generate-quiz",
    description: "Create personalized tests on any topic, difficulty, and format.",
  },
  {
    title: "Practice Questions",
    href: "/generate-questions",
    description: "Generate topic-specific questions with detailed AI explanations.",
  },
  {
    title: "Quiz from Document",
    href: "/generate-from-document",
    description: "Upload your study materials (PDF, DOCX) to create a quiz.",
  },
  {
    title: "AI Study Guide",
    href: "/generate-study-guide",
    description: "Get comprehensive guides with summaries and key concepts.",
  },
   {
    title: "Exam Paper Generator",
    href: "/generate-paper",
    description: "A tool for educators to create and format professional exam papers.",
  },
  {
    title: "Explain Image",
    href: "/image-to-explanation",
    description: "Upload a diagram and get a detailed AI explanation of it.",
  },
]

const examPrepComponents: { title: string; href: string; description: string }[] = [
  {
    title: "MDCAT",
    href: "/mdcat",
    description: "Medical & Dental College Admission Test preparation.",
  },
  {
    title: "ECAT",
    href: "/ecat",
    description: "Engineering College Admission Test preparation.",
  },
  {
    title: "NTS / NAT",
    href: "/nts",
    description: "National Testing Service (NAT) preparation.",
  },
]

const analyticsComponents: { title: string; href: string; description: string }[] = [
  {
    title: "My Stats",
    href: "/my-stats",
    description: "A detailed look at your quiz history and progress over time.",
  },
  {
    title: "Achievements",
    href: "/achievements",
    description: "Track your learning milestones and accomplishments.",
  },
]

export function AppHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) {
    return (
       <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
              <div className="flex items-center gap-2 md:gap-4">
                  <Link href="/" className="flex items-center space-x-2" aria-label="Go to homepage">
                       <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <BrainCircuit className="h-6 w-6" />
                       </div>
                      <span className="hidden sm:inline-block font-bold">Quizzicallabs AI</span>
                  </Link>
              </div>
              
              <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
                  <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
                     <Link href="/#features" className="transition-colors hover:text-primary text-muted-foreground">Features</Link>
                     <Link href="/how-to-use" className="transition-colors hover:text-primary text-muted-foreground">Guides</Link>
                  </nav>

                  <div className="flex items-center gap-1">
                      <div className="hidden items-center gap-2 md:flex">
                          <Button asChild variant="ghost">
                              <Link href="/login">Log In</Link>
                          </Button>
                          <Button asChild>
                              <Link href="/signup">Get Started Free</Link>
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
      </header>
    )
  }

  // App Header for logged in users
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
            <div className="mr-4 hidden md:flex">
                 <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <BrainCircuit className="h-6 w-6" />
                    </div>
                </Link>
            </div>
            
            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/dashboard" legacyBehavior passHref>
                            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), pathname === '/dashboard' && 'bg-accent')}>
                                Dashboard
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger>GenLab</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {genLabComponents.map((component) => (
                                <ListItem
                                key={component.title}
                                title={component.title}
                                href={component.href}
                                >
                                {component.description}
                                </ListItem>
                            ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                     <NavigationMenuItem>
                        <NavigationMenuTrigger>Exam Prep</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {examPrepComponents.map((component) => (
                                <ListItem
                                key={component.title}
                                title={component.title}
                                href={component.href}
                                >
                                {component.description}
                                </ListItem>
                            ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Analytics</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[300px] gap-3 p-4 md:w-[400px]">
                            {analyticsComponents.map((component) => (
                                <ListItem
                                key={component.title}
                                title={component.title}
                                href={component.href}
                                >
                                {component.description}
                                </ListItem>
                            ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Title */}
             <div className="md:hidden">
                <span className="font-bold text-lg">Quizzicallabs AI</span>
            </div>

            <div className="flex flex-1 items-center justify-end gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                        <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/how-to-use">Guides</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
