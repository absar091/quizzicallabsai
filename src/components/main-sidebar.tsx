
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
  Settings,
  BotMessageSquare,
  BookOpen,
  User,
  HelpCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  SidebarTrigger,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "./ui/separator";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const generationTools = [
    {
        href: "/generate-quiz",
        label: "Custom Quiz",
        icon: BotMessageSquare,
    },
    {
        href: "/generate-questions",
        label: "Practice Questions",
        icon: BookOpen,
    },
    {
        href: "/generate-from-document",
        label: "Quiz from Document",
        icon: FileUp,
    },
    {
        href: "/generate-study-guide",
        label: "Study Guide",
        icon: FileText,
    },
];

const examPrep = [
    { href: "/mdcat", label: "MDCAT Prep", icon: GraduationCap },
]

export function MainSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { open } = useSidebar();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
           <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"
              style={{ opacity: open ? 1 : 0, transition: 'opacity 0.3s' }}
            >
                <BrainCircuit className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-primary"
             style={{ opacity: open ? 1 : 0, transition: 'opacity 0.3s' }}
            >Quizzical</span>
           </div>
        </SidebarHeader>
        
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <Separator className="my-2" />

        <SidebarGroup>
            <SidebarMenu>
                 {generationTools.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                            asChild
                            isActive={pathname === item.href}
                            tooltip={{ children: item.label }}
                        >
                            <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
        
        <Separator className="my-2" />

        <SidebarGroup>
            <SidebarMenu>
                 {examPrep.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                            asChild
                            isActive={pathname.startsWith(item.href)}
                            tooltip={{ children: item.label }}
                        >
                            <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Profile" isActive={pathname === '/profile'}>
               <Link href="/profile">
                  <User />
                  <span>Profile</span>
               </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
