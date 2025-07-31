
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowRight, BotMessageSquare, GraduationCap, ClipboardSignature, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";


const features = [
  {
    icon: BotMessageSquare,
    title: "The most intuitive quiz maker",
    description: "Create tailored quizzes based on topic, difficulty, and question type in seconds.",
    image: "https://placehold.co/500x700.png",
    dataAiHint: "quiz mobile",
  },
  {
    icon: GraduationCap,
    title: "Make the most of every quiz taker",
    description: "Practice with specialized tests and full-length mock exams for major entry tests.",
    image: "https://placehold.co/500x700.png",
    dataAiHint: "student learning",
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
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Your Ultimate <br/> <span className="text-primary">AI Study Partner</span>
              </motion.h1>
              <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.2 }}
                 className="max-w-xl text-muted-foreground md:text-xl"
              >
                Generate custom quizzes, practice questions, and AI study guides to master any subject and ace your exams.
              </motion.p>
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.4 }}
                 className="flex flex-col gap-4 sm:flex-row"
              >
                <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/signup">Get Started - it's free</Link>
                </Button>
              </motion.div>
            </div>
        </section>

        <section id="features" className="bg-muted/50 py-16 md:py-24">
            <div className="container mx-auto space-y-24">
                {features.map((feature, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className={cn("text-center md:text-left", index % 2 !== 0 && "md:order-2")}>
                             <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{feature.title}</h2>
                             <p className="max-w-md text-muted-foreground mt-4 mx-auto md:mx-0">{feature.description}</p>
                             <Button asChild variant="link" className="mt-4 px-0">
                                <Link href="/how-to-use">Learn More <ArrowRight className="ml-2 h-4 w-4"/></Link>
                             </Button>
                        </div>
                        <div className="relative h-[500px] w-full">
                           <Image src={feature.image} alt={feature.title} layout="fill" objectFit="contain" className="rounded-xl" data-ai-hint={feature.dataAiHint} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
