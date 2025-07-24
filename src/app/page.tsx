
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, BrainCircuit, Trophy, Share2, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


const features = [
    {
        icon: BrainCircuit,
        title: "AI-Powered Quizzes",
        description: "Instantly generate quizzes on any topic, tailored to your study needs.",
    },
    {
        icon: Trophy,
        title: "Track Your Progress",
        description: "After two quizzes, your dashboard will show scores and performance trends.",
    },
    {
        icon: Share2,
        title: "Share Your Scores",
        description: "Get a shareable message with your results to post on social media.",
    },
    {
        icon: Download,
        title: "Download for Offline Study",
        description: "Save a result card or a full question sheet as a PDF for your records.",
    },
]

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
        <section className="container mx-auto flex flex-col items-center justify-center gap-12 py-16 text-center">
          <div className="space-y-4">
             <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Why Choose Quizzicallabs™?
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
                Everything you need to supercharge your study sessions and achieve academic excellence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
                <Card key={index} className="text-left bg-card/50 border-primary/20 hover:border-primary/50 transition-colors group">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 group-hover:border-primary/50">
                            <feature.icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
