
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowRight, BotMessageSquare, BarChart2, BookOpen, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: BotMessageSquare,
    title: "Custom Quiz Generation",
    description: "Create tailored quizzes based on topic, difficulty, and question type in seconds.",
  },
  {
    icon: BookOpen,
    title: "AI Study Guides",
    description: "Generate comprehensive study guides for any subject to focus your learning.",
  },
  {
    icon: BarChart2,
    title: "Performance Analytics",
    description: "Track your progress with detailed analytics and identify areas for improvement.",
  },
  {
    icon: FileText,
    title: "Quiz from Document",
    description: "Upload your study materials (PDF, DOCX) and let our AI create a quiz for you.",
  },
];

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <AppHeader />
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center gap-12 py-24 text-center md:py-32">
          <div className="flex flex-col items-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Master Any Subject, <span className="text-primary">Instantly.</span>
              </h1>
              <p className="max-w-3xl text-muted-foreground md:text-xl">
                Welcome to Quizzicallabs, the ultimate AI-powered study partner. Generate personalized quizzes, get detailed study guides, and track your progress to conquer any exam.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started for Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                 <Button size="lg" variant="outline" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
        </section>

        <section id="features" className="container mx-auto py-16 md:py-24">
            <div className="flex flex-col items-center text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose Quizzicallabs?</h2>
                <p className="max-w-2xl text-muted-foreground mt-4">
                    Our platform is designed to make learning more efficient and effective. Here’s how we help you succeed.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {features.map((feature, index) => (
                    <Card key={index} className="text-center transition-all hover:shadow-lg hover:-translate-y-1">
                        <CardHeader>
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                                <feature.icon className="h-8 w-8 text-primary" />
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
