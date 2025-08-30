
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, BrainCircuit, Check, GraduationCap, Loader2 } from "lucide-react";
import { PenNib, Student, ChalkboardTeacher } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const FADE_IN_ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

function AnimatedImage({ src, alt, "data-ai-hint": dataAiHint }: { src: string; alt: string; "data-ai-hint": string }) {
    return (
        <motion.div
            className="relative h-80 w-full rounded-2xl overflow-hidden shadow-xl bg-muted"
            variants={FADE_IN_ANIMATION_VARIANTS}
        >
            <Image 
                src={src} 
                alt={alt} 
                data-ai-hint={dataAiHint} 
                fill 
                className="object-contain p-8"
            />
        </motion.div>
    );
}

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
        <section className="container mx-auto flex flex-col items-center justify-center space-y-6 py-24 text-center md:py-32">
            <motion.div 
              initial="hidden"
              animate="show"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              className="flex flex-col items-center space-y-6"
            >
              <motion.h1 
                variants={FADE_IN_ANIMATION_VARIANTS}
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Your Ultimate <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Study Partner</span>
              </motion.h1>
              <motion.p 
                 variants={FADE_IN_ANIMATION_VARIANTS}
                 className="max-w-2xl text-muted-foreground md:text-xl"
              >
                Generate custom quizzes, practice questions, and AI study guides to master any subject. Ace your exams with specialized prep for MDCAT, ECAT, and NTS.
              </motion.p>
              <motion.div 
                 variants={FADE_IN_ANIMATION_VARIANTS}
                 className="flex flex-col gap-4 sm:flex-row"
              >
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started - it's free</Link>
                </Button>
                 <Button size="lg" asChild variant="outline">
                  <Link href="/how-to-use">View the Guides</Link>
                </Button>
              </motion.div>
            </motion.div>
        </section>
        
        <section className="py-16 md:py-24">
            <div className="container mx-auto text-center">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How It Works</h2>
                 <p className="max-w-2xl text-muted-foreground mt-4 mx-auto">Transform your study routine in three simple steps.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
                    <Card className="p-6 bg-muted/30 border-none">
                        <CardHeader className="p-0">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                                <PenNib className="h-6 w-6 text-primary"/>
                            </div>
                            <p className="text-sm font-semibold text-primary">Step 1</p>
                            <CardTitle className="text-xl">Create</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 mt-4">
                             <p className="text-muted-foreground">Choose a tool. Generate a custom quiz from any topic, upload your own notes to create a test, or build a comprehensive study guide.</p>
                        </CardContent>
                    </Card>
                     <Card className="p-6 bg-muted/30 border-none">
                        <CardHeader className="p-0">
                             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                                <BrainCircuit className="h-6 w-6 text-primary"/>
                            </div>
                            <p className="text-sm font-semibold text-primary">Step 2</p>
                            <CardTitle className="text-xl">Learn & Practice</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 mt-4">
                             <p className="text-muted-foreground">Take the AI-generated quizzes, review detailed explanations for incorrect answers, and study with flashcards to reinforce your knowledge.</p>
                        </CardContent>
                    </Card>
                     <Card className="p-6 bg-muted/30 border-none">
                        <CardHeader className="p-0">
                           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                                <GraduationCap className="h-6 w-6 text-primary"/>
                            </div>
                            <p className="text-sm font-semibold text-primary">Step 3</p>
                            <CardTitle className="text-xl">Master</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 mt-4">
                             <p className="text-muted-foreground">Track your performance on the dashboard, review bookmarked questions, and tackle full-length mock exams to ace your tests.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        <motion.section 
            id="features" 
            className="py-16 md:py-24 bg-background"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.2 } },
            }}
        >
            <div className="container mx-auto">
                 <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">The Ultimate Toolkit for Modern Learning</h2>
                     <p className="max-w-3xl text-muted-foreground mt-4 mx-auto">Quizzicallabs AI is more than just a quiz maker. It's a comprehensive suite of intelligent tools designed to support every aspect of your academic journey.</p>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div variants={FADE_IN_ANIMATION_VARIANTS}>
                        <div className="mb-4">
                            <Badge variant="secondary" className="flex items-center gap-2 w-fit"><Student className="h-4 w-4" weight="fill" /> For Students</Badge>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Personalized Quizzes from Any Topic</h3>
                        <p className="text-muted-foreground mb-6">Stop searching for generic practice tests. Enter any subject, chapter, or concept and our AI will generate a high-quality quiz tailored to your specified difficulty and question style. It's perfect for targeted study sessions.</p>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-center gap-3"><Check className="h-5 w-5 text-primary"/><span>Create quizzes from millions of topics.</span></li>
                            <li className="flex items-center gap-3"><Check className="h-5 w-5 text-primary"/><span>Choose from MCQs, descriptive questions, and more.</span></li>
                             <li className="flex items-center gap-3"><Check className="h-5 w-5 text-primary"/><span>Get instant feedback and AI-powered explanations.</span></li>
                        </ul>
                    </motion.div>
                     <AnimatedImage 
                        src="https://placehold.co/800x600/e2e8f0/1A237E?text=Custom+Quiz" 
                        alt="Screenshot of custom quiz generator interface" 
                        data-ai-hint="app interface quiz"
                     />
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-24">
                     <AnimatedImage 
                        src="https://placehold.co/800x600/e2e8f0/1A237E?text=Exam+Paper+Generator"
                        alt="Screenshot of exam paper generator for educators" 
                        data-ai-hint="app interface paper"
                        className="lg:order-last"
                     />
                    <motion.div variants={FADE_IN_ANIMATION_VARIANTS}>
                        <div className="mb-4">
                            <Badge variant="secondary" className="flex items-center gap-2 w-fit"><ChalkboardTeacher className="h-4 w-4" weight="fill" /> For Educators</Badge>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Effortless Exam Paper Creation</h3>
                        <p className="text-muted-foreground mb-6">Save hours of administrative work. Our Exam Paper Generator lets you create professional, formatted test papers in minutes. Generate multiple variants to prevent cheating and get an answer key automatically.</p>
                         <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-center gap-3"><Check className="h-5 w-5 text-primary"/><span>Generate multiple paper variants instantly.</span></li>
                            <li className="flex items-center gap-3"><Check className="h-5 w-5 text-primary"/><span>Customize headers, marks, and time limits.</span></li>
                             <li className="flex items-center gap-3"><Check className="h-5 w-5 text-primary"/><span>Download print-ready PDFs with answer keys.</span></li>
                        </ul>
                    </motion.div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-24">
                    <motion.div variants={FADE_IN_ANIMATION_VARIANTS}>
                        <div className="mb-4">
                            <Badge variant="secondary">Syllabus-Based</Badge>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Specialized Entry Test Preparation</h3>
                        <p className="text-muted-foreground mb-6">Ace your university admission tests with dedicated modules for MDCAT, ECAT, and NTS. Our AI generates chapter-wise and full-length mock tests that are strictly aligned with the official syllabus and past paper standards.</p>
                          <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-center gap-3"><Check className="h-5 w-5 text-primary"/><span>Content tailored to official Pakistani exam syllabi.</span></li>
                            <li className="flex items-center gap-3"><Check className="h-5 w-5 text-primary"/><span>Practice with full-length, timed mock tests.</span></li>
                             <li className="flex items-center gap-3"><Check className="h-5 w-5 text-primary"/><span>Track your performance and identify weak areas.</span></li>
                        </ul>
                    </motion.div>
                    <AnimatedImage 
                        src="https://placehold.co/800x600/e2e8f0/1A237E?text=Exam+Prep+Module"
                        alt="Screenshot of exam prep module" 
                        data-ai-hint="app interface exam"
                    />
                 </div>
            </div>
        </motion.section>

        <section className="py-16 md:py-24 bg-muted/30">
             <div className="container mx-auto text-center max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Transform Your Learning?</h2>
                <p className="text-muted-foreground mt-4 mx-auto">Create a free account and get instant access to the entire suite of AI-powered study tools. No credit card required.</p>
                 <div className="mt-8">
                     <Button size="lg" asChild>
                        <Link href="/signup">
                            Sign Up for Free
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                 </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
