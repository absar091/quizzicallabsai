
"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
         <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div><div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // or a loading component, as the redirect is happening
  }

  return (
    <div className="flex min-h-screen flex-col">
       <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div><div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      <AppHeader />
      <main className="flex-1">
        <div className="container py-8">
            {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
