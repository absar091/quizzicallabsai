"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, BrainCircuit, Trophy, Share2, Download, Github, Linkedin, Mail } from "lucide-react";
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
        <section className="container mx-auto flex flex-col items-center justify-center gap-12 py-24 text-center">
          <div className="flex flex-col items-center space-y-4">
             <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Absar Ahmad Rao
            </h1>
            <p className="text-lg text-muted-foreground">
                Creator of Quizzicallabs™
            </p>
            <div className="max-w-2xl rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
                <p className="mb-6 text-lg">
                    A full-stack developer passionate about creating modern, useful applications with a focus on seamless user experience and cutting-edge AI integration.
                </p>
                <div className="flex justify-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer"><Github /></a>
                    </Button>
                     <Button variant="outline" size="icon" asChild>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><Linkedin /></a>
                    </Button>
                     <Button variant="outline" size="icon" asChild>
                        <a href="mailto:ahmadraoabsar@gmail.com"><Mail /></a>
                    </Button>
                </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
