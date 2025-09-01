
"use client";

import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Question, FileText, Shield, Moon, Sun, SignOut, Bell, User, Student, Cake, ArrowRight } from "@phosphor-icons/react";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import Link from 'next/link';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePlan } from "@/hooks/usePlan";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const supportLinks = [
    { href: "/how-to-use", label: "How to Use Guide", icon: Question },
    { href: "/how-to-use/contact-support", label: "Contact Us", icon: FileText },
    { href: "/terms-of-use", label: "Terms of Use", icon: Shield },
    { href: "/privacy-policy", label: "Privacy Policy", icon: Shield },
];

export default function ProfilePage() {
  const { user, loading, logout, updateUserPlan } = useAuth();
  const { theme, setTheme } = useTheme();
  const { plan } = usePlan();
  const { toast } = useToast();
  const [redeemCode, setRedeemCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleRedeemCode = async () => {
    if (!redeemCode.trim()) {
        toast({ title: "Please enter a code.", variant: "destructive"});
        return;
    }
    setIsRedeeming(true);
    const proCodes = process.env.NEXT_PUBLIC_PRO_ACCESS_CODES?.split(',') || [];
    if (proCodes.includes(redeemCode.trim())) {
        await updateUserPlan('Pro');
        toast({ title: "Success!", description: "You've been upgraded to the Pro plan." });
    } else {
        toast({ title: "Invalid Code", description: "The code you entered is not valid.", variant: "destructive" });
    }
    setRedeemCode('');
    setIsRedeeming(false);
  }

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
            <h3 className="text-sm font-semibold text-muted-foreground px-4">SUBSCRIPTION</h3>
            <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <div>
                            <CardTitle>Your Plan</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                                {plan === 'Pro' && <Sparkles weight="fill" className="text-accent h-4 w-4"/>}
                                You are on the <span className="font-bold text-primary">{plan} Plan</span>
                            </CardDescription>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/pricing">Manage <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </div>
                </CardHeader>
                 {plan === 'Free' && (
                    <CardContent>
                        <div className="space-y-2">
                             <Label htmlFor="redeem-code">Redeem Access Code</Label>
                             <div className="flex gap-2">
                                <Input id="redeem-code" placeholder="Enter code..." value={redeemCode} onChange={(e) => setRedeemCode(e.target.value)} />
                                <Button onClick={handleRedeemCode} disabled={isRedeeming}>
                                    {isRedeeming ? 'Redeeming...' : 'Redeem'}
                                </Button>
                             </div>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>

        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground px-4">ACCOUNT</h3>
            <Card className="shadow-sm">
                <CardContent className="divide-y p-0">
                    <DetailRow label="Father's Name" value={user?.fatherName} icon={User} />
                    <DetailRow label="Class / Level" value={user?.className} icon={Student} />
                    <DetailRow label="Age" value={user?.age} icon={Cake}/>
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
