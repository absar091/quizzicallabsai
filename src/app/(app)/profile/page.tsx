
"use client";

import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  }

  const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | null | undefined }) => (
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

      <Card className="max-w-2xl mx-auto bg-card/80 backdrop-blur-sm">
        <CardHeader className="border-b">
            <div className="flex items-center gap-6">
                 {loading ? (
                    <Skeleton className="h-24 w-24 rounded-full" />
                 ) : (
                    <Avatar className="h-24 w-24">
                        <AvatarImage src="https://images.unsplash.com/photo-1566669419640-ae09e20a18d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8QlJBSU4lMjBBTklNSUV8ZW58MHx8fHwxNzUzMzc2NDQzfDA&ixlib=rb-4.1.0&q=80&w=1080" alt={user?.displayName ?? ""} data-ai-hint="user avatar" />
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
        <CardContent className="pt-6 space-y-6">
          {loading ? (
            <div className="space-y-6">
                <div className="flex items-center">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="ml-4 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-40" />
                    </div>
                </div>
                 <div className="flex items-center">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="ml-4 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                </div>
                 <div className="flex items-center">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="ml-4 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                </div>
            </div>
          ) : user ? (
            <div className="space-y-6">
                <DetailRow icon={User} label="Full Name" value={user.displayName} />
                <DetailRow icon={Mail} label="Email Address" value={user.email} />
                <DetailRow icon={GraduationCap} label="Class" value={user.className} />
            </div>
          ) : (
            <p>Not logged in. Redirecting...</p>
          )}

           <div className="border-t pt-6 flex justify-end">
             <Button onClick={handleLogout} variant="destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
