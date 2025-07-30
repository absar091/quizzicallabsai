
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowRight, BotMessageSquare, GraduationCap, ClipboardSignature, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: BotMessageSquare,
    title: "Custom Quiz Generation",
    description: "Create tailored quizzes based on topic, difficulty, and question type in seconds.",
  },
  {
    icon: GraduationCap,
    title: "Exam Prep (MDCAT/ECAT/NTS)",
    description: "Practice with specialized tests and full-length mock exams for major entry tests.",
  },
  {
    icon: FileText,
    title: "Quiz from Document",
    description: "Upload your study materials (PDF, DOCX) and let our AI create a quiz for you.",
  },
  {
    icon: ClipboardSignature,
    title: "Exam Paper Generator",
    description: "A powerful tool for educators to create and format professional exam papers.",
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
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center gap-12 py-24 text-center md:py-32">
          <div className="flex flex-col items-center space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Master Any Subject, <span className="text-primary">Instantly.</span>
              </motion.h1>
              <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.2 }}
                 className="max-w-3xl text-muted-foreground md:text-xl"
              >
                Welcome to Quizzicallabs AI, the ultimate AI study partner. Generate personalized quizzes, prepare for MDCAT, ECAT & NTS with mock tests, and turn any document into a quiz.
              </motion.p>
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.4 }}
                 className="flex flex-col gap-4 sm:flex-row"
              >
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started for Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                 <Button size="lg" variant="outline" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </motion.div>
            </div>
        </section>

        <section id="features" className="bg-muted/50 py-16 md:py-24">
            <div className="container mx-auto">
                <div className="flex flex-col items-center text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose Quizzicallabs AI?</h2>
                    <p className="max-w-2xl text-muted-foreground mt-4">
                        Our platform is designed to make learning more efficient and effective. Here’s how we help you succeed.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <Card key={index} className="text-center transition-all hover:shadow-xl hover:-translate-y-2 transform-gpu">
                            <CardHeader>
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                                    <feature.icon className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
