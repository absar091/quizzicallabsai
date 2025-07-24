
"use client";

import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        description="View and manage your account details."
      />

      <Card className="max-w-xl mx-auto bg-card/80 backdrop-blur-sm">
        <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>This is the information associated with your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center space-x-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://placehold.co/100x100.png" alt={user.displayName ?? ""} data-ai-hint="user avatar" />
                <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-semibold">{user.displayName}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          ) : (
            <p>Not logged in. Redirecting...</p>
          )}

           <Button onClick={handleLogout} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    