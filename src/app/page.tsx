
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowRight, BotMessageSquare, GraduationCap, FileText, CheckCircle, Sparkles, BookOpen, User, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const FeatureCard1 = () => (
  <div className="relative h-[500px] w-full max-w-sm mx-auto bg-card p-6 rounded-2xl shadow-2xl border flex flex-col justify-between">
    <div className="space-y-4">
      <CardHeader className="p-0">
        <CardTitle className="text-xl">Custom Quiz Setup</CardTitle>
        <CardDescription>What topic do you want to learn?</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="e.g., The Solar System"
            className="w-full p-3 rounded-lg border bg-background"
            readOnly
          />
          <div className="flex justify-between gap-2">
            <Button variant="outline" className="w-full">Easy</Button>
            <Button variant="default" className="w-full">Medium</Button>
            <Button variant="outline" className="w-full">Hard</Button>
          </div>
          <div className="flex items-center space-x-2">
             <CheckCircle className="h-5 w-5 text-primary" />
             <span className="text-sm">Multiple Choice</span>
          </div>
           <div className="flex items-center space-x-2 text-muted-foreground">
             <CheckCircle className="h-5 w-5 " />
             <span className="text-sm">Descriptive</span>
          </div>
        </div>
      </CardContent>
    </div>
    <Button size="lg" className="w-full bg-accent text-accent-foreground">
      <Sparkles className="mr-2 h-4 w-4" /> Generate Quiz
    </Button>
  </div>
);

const FeatureCard2 = () => (
  <div className="relative h-[500px] w-full max-w-sm mx-auto bg-card p-6 rounded-2xl shadow-2xl border flex flex-col justify-between">
     <div className="space-y-4">
      <CardHeader className="p-0">
        <CardTitle className="text-xl">MDCAT: Biology</CardTitle>
        <CardDescription>Chapter: Biological Molecules</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-3">
          <p className="font-semibold text-base">1. Which of these is a polysaccharide?</p>
          <div className="space-y-2">
            <div className="p-3 rounded-lg border bg-background">Glucose</div>
            <div className="p-3 rounded-lg border bg-primary/10 border-primary">Cellulose</div>
            <div className="p-3 rounded-lg border bg-background">Fructose</div>
            <div className="p-3 rounded-lg border bg-background">Lactose</div>
          </div>
        </div>
      </CardContent>
    </div>
     <div className="space-y-2">
      <Button variant="outline" size="lg" className="w-full">
        <BookOpen className="mr-2 h-4 w-4"/>
        View Syllabus
      </Button>
      <Button size="lg" className="w-full">
        Start Test <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
);

const allFeatures = [
  {
    icon: BotMessageSquare,
    title: "Custom Quiz Generator",
    description: "Create highly tailored quizzes on any topic, difficulty, and format in seconds.",
  },
  {
    icon: GraduationCap,
    title: "Entry Test Prep",
    description: "Practice with specialized modules for MDCAT, ECAT, and NTS, including mock exams.",
  },
  {
    icon: FileText,
    title: "AI Study Guides",
    description: "Generate comprehensive study guides with key concepts, analogies, and self-quizzes.",
  },
    {
    icon: BookOpen,
    title: "Practice Questions",
    description: "Instantly generate questions on any topic, complete with answers and AI explanations.",
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
                 <Button size="lg" asChild variant="outline">
                  <Link href="/how-to-use">View the Guides</Link>
                </Button>
              </motion.div>
            </div>
        </section>

        <section id="features" className="py-16 md:py-24">
            <div className="container mx-auto text-center">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Everything you need to succeed</h2>
                 <p className="max-w-2xl text-muted-foreground mt-4 mx-auto">From quick practice sessions to full-length mock exams, our tools are designed to support every step of your learning journey.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                    {allFeatures.map((feature, index) => (
                        <Card key={index} className="text-left">
                            <CardHeader>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
                                    <feature.icon className="h-6 w-6 text-primary"/>
                                </div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            </div>
        </section>
        
        <section className="bg-muted/50 py-16 md:py-24">
            <div className="container mx-auto">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="text-center md:text-left">
                             <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">The most intuitive quiz maker</h2>
                             <p className="max-w-md text-muted-foreground mt-4 mx-auto md:mx-0">Create tailored quizzes based on topic, difficulty, and question type in seconds.</p>
                             <Button asChild variant="link" className="mt-4 px-0">
                                <Link href="/how-to-use/custom-quiz">Learn More <ArrowRight className="ml-2 h-4 w-4"/></Link>
                             </Button>
                        </div>
                        <div>
                           <FeatureCard1 />
                        </div>
                    </div>
            </div>
        </section>

        <section className="py-16 md:py-24">
             <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left md:order-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Excel in your entry tests</h2>
                        <p className="max-w-md text-muted-foreground mt-4 mx-auto md:mx-0">Practice with specialized tests and full-length mock exams for MDCAT, ECAT, and NTS.</p>
                        <Button asChild variant="link" className="mt-4 px-0">
                            <Link href="/how-to-use/entry-test-prep">Learn More <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </div>
                    <div className="md:order-1">
                        <FeatureCard2 />
                    </div>
                </div>
            </div>
        </section>

        <section className="bg-muted/50 py-16 md:py-24">
            <div className="container mx-auto max-w-4xl text-center">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">A Note from the Creator</h2>
                 <Card className="bg-background">
                    <CardContent className="pt-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <Avatar className="h-24 w-24">
                                <AvatarFallback className="text-4xl">AR</AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                                <p className="text-muted-foreground leading-relaxed">
                                    "As a student myself, I built Quizzicallabs AI to solve a problem I faced every day: finding high-quality, specific study materials on demand. My goal is to empower students and educators with a tool that makes learning more effective and personalized. I hope it helps you on your academic journey."
                                </p>
                                <p className="font-semibold mt-4">Absar Ahmad Rao</p>
                                <p className="text-sm text-muted-foreground">Creator of Quizzicallabs AI</p>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
