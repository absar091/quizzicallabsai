
"use client";

import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, GraduationCap, Trash2, ShieldAlert, Cake, FileText, Info, Phone, MessageSquare, ShieldCheck, Moon, Sun, Bot, HelpCircle, Trophy, BarChart2, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";

const infoLinks = [
    { href: "/how-to-use", label: "How to Use Guide", icon: HelpCircle },
    { href: "/about-us", label: "About Us", icon: Info },
    { href: "/how-to-use/contact-support", label: "Contact Us", icon: Phone },
];

const legalLinks = [
    { href: "/terms-of-use", label: "Terms of Use", icon: FileText },
    { href: "/privacy-policy", label: "Privacy Policy", icon: ShieldCheck },
    { href: "/disclaimer", label: "Disclaimer", icon: ShieldAlert },
    { href: "/cookies", label: "Cookie Policy", icon: "🍪" },
];


export default function ProfilePage() {
  const { user, loading, logout, deleteAccount } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { toast } = useToast();
  const [deleteReason, setDeleteReason] = useState("");
  const [isHelpBotOpen, setIsHelpBotOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      router.push('/');
    } catch (error: any) {
        toast({
            title: "Error Deleting Account",
            description: "There was a problem deleting your account. You may need to sign out and sign back in to complete this action.",
            variant: "destructive"
        })
    }
  }

  const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number | null | undefined }) => (
    <div className="flex items-center gap-4">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold">{value || 'N/A'}</p>
        </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Profile"
        description="View and manage your account details and app settings."
      />

      <div className="space-y-8">
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    {loading ? (
                        <Skeleton className="h-16 w-16 rounded-full" />
                    ) : (
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-2xl">{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    )}
                    <div>
                        {loading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        ) : (
                            <>
                                <CardTitle className="text-2xl">{user?.displayName}</CardTitle>
                                <CardDescription>{user?.email}</CardDescription>
                            </>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                {loading ? (
                    <>
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </>
                ) : user ? (
                    <>
                        <DetailRow icon={GraduationCap} label="Class / Level" value={user.className} />
                        <DetailRow icon={Cake} label="Age" value={user.age} />
                    </>
                ) : null}
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Analytics & Progress</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <Button asChild variant="outline" className="justify-start gap-3">
                    <Link href="/my-stats">
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                        My Stats
                    </Link>
                 </Button>
                 <Button asChild variant="outline" className="justify-start gap-3">
                    <Link href="/achievements">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        Achievements
                    </Link>
                 </Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Settings & Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                        <Sun className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor="theme-toggle">Theme</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant={theme === 'light' ? 'default' : 'ghost'} size="sm" onClick={() => setTheme('light')}>Light</Button>
                        <Button variant={theme === 'dark' ? 'default' : 'ghost'} size="sm" onClick={() => setTheme('dark')}>Dark</Button>
                    </div>
                </div>
                
                <h3 className="font-semibold pt-4">Resources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {infoLinks.map(link => (
                         <Button key={link.href} asChild variant="outline" className="justify-start gap-3">
                            <Link href={link.href}>
                                {typeof link.icon === 'string' ? <span>{link.icon}</span> : <link.icon className="h-4 w-4 text-muted-foreground" />}
                                {link.label}
                            </Link>
                         </Button>
                    ))}
                </div>

                <Separator className="my-4"/>

                <h3 className="font-semibold">Legal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {legalLinks.map(link => (
                         <Button key={link.href} asChild variant="outline" className="justify-start gap-3">
                            <Link href={link.href}>
                                {typeof link.icon === 'string' ? <span>{link.icon}</span> : <link.icon className="h-4 w-4 text-muted-foreground" />}
                                {link.label}
                            </Link>
                         </Button>
                    ))}
                </div>
            </CardContent>
        </Card>

        <Card className="border-destructive/50 bg-destructive/5">
             <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline"><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Your progress is saved. You can always log back in to continue where you left off.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                         <div className="space-y-2">
                            <Label htmlFor="delete-reason">To help us improve, please share why you are deleting your account (optional).</Label>
                            <Textarea
                            id="delete-reason"
                            placeholder="I'm deleting my account because..."
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value)}
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Yes, delete my account</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
