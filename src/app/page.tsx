
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, BrainCircuit, ArrowRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
        <section className="container mx-auto flex flex-col items-center justify-center gap-12 py-16 md:py-24">
         <Alert className="max-w-3xl bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-300">
            <AlertTriangle className="h-4 w-4 !text-yellow-500" />
            <AlertTitle className="text-yellow-600 dark:text-yellow-200 font-bold">App in Development</AlertTitle>
            <AlertDescription>
              This app is a project by Absar Ahmad Rao and is currently under active development. Your feedback is welcome!
            </AlertDescription>
          </Alert>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start space-y-6 text-left">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                Master Any Subject, <span className="text-primary">Instantly.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Welcome to Quizzicallabs™, the ultimate study tool. Generate, take, and share personalized quizzes to conquer your exams with the power of AI.
              </p>
              <div className="flex gap-4">
                <Button size="lg" asChild>
                  <Link href="/generate-quiz">Create a Quiz <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                 <Button size="lg" variant="outline" asChild>
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
                <div className="relative flex items-center justify-center w-80 h-80">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="relative flex items-center justify-center gap-4 bg-background/60 backdrop-blur-sm p-8 rounded-full">
                        <BrainCircuit className="h-20 w-20 text-primary" />
                        <h2 className="text-3xl font-bold">Quizzicallabs™</h2>
                    </div>
                </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

    