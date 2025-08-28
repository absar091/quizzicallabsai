
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowRight, BotMessageSquare, GraduationCap, FileText, CheckCircle, Sparkles, BookOpen, User, BrainCircuit, Quote, FilePlus, Brain, Star, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";


const FeatureCard1 = () => (
  <div className="relative h-[500px] w-full max-w-sm mx-auto bg-card p-6 rounded-2xl shadow-lg border flex flex-col justify-between">
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
            defaultValue="The Solar System"
            readOnly
          />
          <div className="flex justify-between gap-2">
            <Button variant="outline" className="w-full">Easy</Button>
            <Button variant="secondary" className="w-full">Medium</Button>
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
    <Button size="lg" className="w-full">
      <Sparkles className="mr-2 h-4 w-4" /> Generate Quiz
    </Button>
  </div>
);

const FeatureCard2 = () => (
  <div className="relative h-[500px] w-full max-w-sm mx-auto bg-card p-6 rounded-2xl shadow-lg border flex flex-col justify-between">
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
            <div className="p-3 rounded-lg border bg-secondary border-primary">Cellulose</div>
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

const FeatureCard3 = () => (
    <div className="relative h-[500px] w-full max-w-sm mx-auto bg-card p-6 rounded-2xl shadow-lg border flex flex-col justify-between">
        <div className="space-y-4">
            <CardHeader className="p-0">
                <CardTitle className="text-xl">AI Study Guide</CardTitle>
                <CardDescription>Topic: Quantum Mechanics</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-bold">Key Concepts</h3>
                    <p className="text-sm text-muted-foreground"><strong>Superposition:</strong> An object can be in multiple states at once...</p>
                    <p className="text-sm text-muted-foreground"><strong>Entanglement:</strong> Two particles can be linked, no matter the distance...</p>
                </div>
                 <div className="space-y-3 p-4 bg-muted/50 rounded-lg mt-3">
                    <h3 className="font-bold">Simple Analogy</h3>
                    <p className="text-sm text-muted-foreground">Think of superposition like a spinning coin. It's both heads and tails until you look.</p>
                </div>
            </CardContent>
        </div>
        <Button size="lg" className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download Guide
        </Button>
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
              <div 
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Your Ultimate <br/> <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Study Partner</span>
              </div>
              <p 
                 className="max-w-xl text-muted-foreground md:text-xl"
              >
                Generate custom quizzes, practice questions, and AI study guides to master any subject and ace your exams.
              </p>
              <div 
                 className="flex flex-col gap-4 sm:flex-row"
              >
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started - it's free</Link>
                </Button>
                 <Button size="lg" asChild variant="outline">
                  <Link href="/how-to-use">View the Guides</Link>
                </Button>
              </div>
            </div>
        </section>

        <section id="features" className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto text-center">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Everything you need to succeed</h2>
                 <p className="max-w-2xl text-muted-foreground mt-4 mx-auto">From quick practice sessions to full-length mock exams, our tools are designed to support every step of your learning journey.</p>
                 <div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
                  >
                    {allFeatures.map((feature, index) => (
                        <div
                          key={index} 
                        >
                            <Card className="text-left h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
                        </div>
                    ))}
                 </div>
            </div>
        </section>
        
        <section className="bg-background py-16 md:py-24">
            <div className="container mx-auto text-center">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">See Quizzicallabs AI in Action</h2>
                 <p className="max-w-2xl text-muted-foreground mt-4 mx-auto">Experience the power of AI-driven learning tools that adapt to your needs.</p>
                <div className="mt-12">
                     <Carousel
                        opts={{ align: "start", loop: true, }}
                        plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
                        className="w-full"
                    >
                        <CarouselContent>
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3 flex justify-center"><FeatureCard1 /></CarouselItem>
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3 flex justify-center"><FeatureCard2 /></CarouselItem>
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3 flex justify-center"><FeatureCard3 /></CarouselItem>
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
             <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How It Works</h2>
                <p className="max-w-2xl text-muted-foreground mt-4 mx-auto">Master any topic in three simple steps.</p>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
                    <div 
                        className="flex flex-col items-center gap-4"
                     >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20">
                            <FilePlus className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="text-xl font-semibold">1. Generate</h3>
                        <p className="text-muted-foreground">Instantly create quizzes, practice questions, or study guides from any topic or document.</p>
                    </div>
                     <div 
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20">
                            <Brain className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="text-xl font-semibold">2. Practice</h3>
                        <p className="text-muted-foreground">Take tailored tests, get instant feedback, and review AI-powered explanations to deepen your understanding.</p>
                    </div>
                     <div 
                        className="flex flex-col items-center gap-4"
                     >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20">
                            <Star className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="text-xl font-semibold">3. Master</h3>
                        <p className="text-muted-foreground">Track your progress on the dashboard, identify weak spots, and conquer your exams with confidence.</p>
                    </div>
                 </div>
            </div>
        </section>

        <section className="relative bg-background py-24 sm:py-32">
            <div 
              className="container mx-auto max-w-4xl text-center relative"
            >
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-12">A Note from the Creator</h2>
                 <Card className="bg-muted/30 backdrop-blur-sm shadow-xl border">
                    <CardContent className="p-8 md:p-12">
                        <div className="grid md:grid-cols-3 gap-8 items-center">
                           <div className="flex flex-col items-center md:items-start">
                             <Avatar className="h-28 w-28 border-4 border-primary/20">
                                <AvatarFallback className="text-5xl">AR</AvatarFallback>
                            </Avatar>
                             <p className="font-bold mt-4 text-xl">Absar Ahmad Rao</p>
                             <p className="text-sm text-muted-foreground">Creator of Quizzicallabs AI</p>
                           </div>
                           <div className="md:col-span-2 relative text-left">
                                <Quote className="absolute -top-4 -left-4 h-12 w-12 text-primary/10" />
                                <p className="text-lg text-muted-foreground leading-relaxed z-10">
                                    As a student myself, I built Quizzicallabs AI to solve a problem I faced every day: finding high-quality, specific study materials on demand. My goal is to empower students and educators with a tool that makes learning more effective and personalized. I hope it helps you on your academic journey.
                                </p>
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
