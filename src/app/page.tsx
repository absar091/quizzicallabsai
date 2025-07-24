
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user) {
    return null; // or a loading spinner, as the redirect is happening
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center gap-6 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Welcome to Quizzicallabs AI
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Your personal AI-powered learning partner. Create custom quizzes,
            practice for exams, and master any subject with ease.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
