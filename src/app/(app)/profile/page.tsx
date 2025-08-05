
"use client";

import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, FileText, Shield, Moon, Sun, SignOut, Bell, User, Student, Cake } from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import Link from 'next/link';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const supportLinks = [
    { href: "/how-to-use", label: "How to Use Guide", icon: LifeBuoy },
    { href: "/how-to-use/contact-support", label: "Contact Us", icon: FileText },
    { href: "/terms-of-use", label: "Terms of Use", icon: Shield },
    { href: "/privacy-policy", label: "Privacy Policy", icon: Shield },
];

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const DetailRow = ({ label, value, icon: Icon }: { label: string; value: string | number | null | undefined; icon: React.ElementType }) => (
    <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-5 w-5" />
          <p>{label}</p>
        </div>
        <p className="font-medium">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div>
      <PageHeader title="Profile & Settings"/>

      <div className="space-y-8">
        <Card className="shadow-sm">
            <CardHeader className="text-center">
                 <div className="mt-2">
                    {loading ? (
                        <div className="space-y-2 flex flex-col items-center">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    ) : (
                        <>
                            <CardTitle className="text-xl font-semibold">{user?.displayName}</CardTitle>
                            <CardDescription>{user?.email}</CardDescription>
                        </>
                    )}
                </div>
            </CardHeader>
        </Card>

        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground px-4">ACCOUNT</h3>
            <Card className="shadow-sm">
                <CardContent className="divide-y p-0">
                    <DetailRow label="Class / Level" value={user?.className} icon={Student} />
                    <DetailRow label="Age" value={user?.age} icon={Cake}/>
                    <div className="flex items-center justify-between p-4">
                        <p className="text-muted-foreground">Manage Subscription</p>
                        <p className="font-medium text-primary">Free Plan</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-4">
             <h3 className="text-sm font-semibold text-muted-foreground px-4">APP SETTINGS</h3>
            <Card className="shadow-sm">
                 <CardContent className="divide-y p-0">
                    <div className="flex items-center justify-between p-4">
                        <Label htmlFor="theme-toggle" className="text-muted-foreground flex items-center gap-2">
                            {theme === 'dark' ? <Moon className="h-5 w-5"/> : <Sun className="h-5 w-5"/>}
                            <span>Theme</span>
                        </Label>
                        <Switch
                            id="theme-toggle"
                            checked={theme === 'dark'}
                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                        />
                    </div>
                     <div className="flex items-center justify-between p-4">
                        <Label htmlFor="notifications-toggle" className="text-muted-foreground flex items-center gap-2">
                           <Bell className="h-5 w-5"/>
                            <span>Notifications</span>
                        </Label>
                        <Switch id="notifications-toggle" />
                    </div>
                </CardContent>
            </Card>
        </div>

         <div className="space-y-4">
             <h3 className="text-sm font-semibold text-muted-foreground px-4">SUPPORT & LEGAL</h3>
            <Card className="shadow-sm">
                 <CardContent className="divide-y p-0">
                    {supportLinks.map(link => (
                        <Link href={link.href} key={link.href} className="flex items-center justify-between p-4 text-muted-foreground hover:bg-secondary">
                             <div className="flex items-center gap-2">
                                <link.icon className="h-5 w-5"/>
                                <span>{link.label}</span>
                             </div>
                        </Link>
                    ))}
                </CardContent>
            </Card>
        </div>
        
        <div className="pt-4">
            <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10" onClick={logout}>
                <SignOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </div>
      </div>
    </div>
  );
}
