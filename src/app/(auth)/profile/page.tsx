
"use client";

import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, GraduationCap, Trash2, ShieldAlert, Cake } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { clearUserData } from "@/lib/indexed-db";

export default function ProfilePage() {
  const { user, loading, logout, deleteAccount } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [deleteReason, setDeleteReason] = useState("");

  const handleLogout = async () => {
    await logout();
  }

  const handleDeleteAccount = async () => {
    try {
      if (user) {
        await clearUserData(user.uid);
      }
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
    <div className="flex items-center">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div className="ml-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold">{value || 'N/A'}</p>
        </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Profile"
        description="View and manage your account details."
      />

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center gap-6">
                        {loading ? (
                            <Skeleton className="h-24 w-24 rounded-full" />
                        ) : (
                            <Avatar className="h-24 w-24">
                                <AvatarImage src="https://images.unsplash.com/photo-1678931547963-ab9017fc35c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOHx8YnJhaW4lMjBhbmltaWV8ZW58MHx8fHwxNzUzNjE1NjAwfDA&ixlib=rb-4.1.0&q=80&w=1080" alt={user?.displayName ?? ""} data-ai-hint="user avatar" />
                                <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        )}
                        <div>
                            {loading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-40" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            ) : (
                                <>
                                    <CardTitle className="text-3xl">{user?.displayName}</CardTitle>
                                    <CardDescription>This is the information associated with your account.</CardDescription>
                                </>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                {loading ? (
                    <div className="grid md:grid-cols-2 gap-y-6">
                        {[...Array(4)].map((_, i) => (
                             <div key={i} className="flex items-center">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <div className="ml-4 space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-5 w-40" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : user ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                        <DetailRow icon={User} label="Full Name" value={user.displayName} />
                        <DetailRow icon={Mail} label="Email Address" value={user.email} />
                        <DetailRow icon={GraduationCap} label="Class" value={user.className} />
                        <DetailRow icon={Cake} label="Age" value={user.age} />
                    </div>
                ) : (
                    <p>Not logged in. Redirecting...</p>
                )}
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-1">
            <Card>
                 <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                    <CardDescription>Manage your account settings and actions.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
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
                 <CardFooter className="flex items-start gap-2 bg-destructive/10 text-destructive p-4 rounded-b-lg border-t border-destructive/20">
                    <ShieldAlert className="h-5 w-5 mt-1 shrink-0" />
                    <p className="text-xs">
                        Deleting your account is final. There is no way to recover it.
                    </p>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
