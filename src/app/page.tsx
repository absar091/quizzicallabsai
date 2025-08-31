
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, GraduationCap, Loader2, BrainCircuit, BookOpen, Lightbulb, Users } from "lucide-react";
import { CheckSquare, FileArrowUp, PenNib } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, type Variants } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FADE_IN_ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const features = [
  {
    icon: Lightbulb,
    title: "Custom Quizzes",
    description: "Generate tailored tests on any topic with custom difficulty and question formats.",
  },
  {
    icon: FileArrowUp,
    title: "Quiz from Document",
    description: "Upload your notes, PDFs, or images to create quizzes directly from your material.",
  },
  {
    icon: GraduationCap,
    title: "Entry Test Prep",
    description: "Syllabus-specific preparation for MDCAT, ECAT, and NTS with mock exams.",
  },
  {
    icon: BookOpen,
    title: "AI Study Guides",
    description: "Generate comprehensive guides on any topic, complete with summaries and key concepts.",
  },
  {
    icon: BrainCircuit,
    title: "AI Explanations",
    description: "Get detailed, easy-to-understand explanations for any question you get wrong.",
  },
  {
    icon: PenNib,
    title: "Exam Paper Generator",
    description: "A tool for educators to create and format professional exam papers with multiple variants.",
  },
];

const whoIsItFor = [
  {
    icon: Users,
    title: "For Students",
    points: [
      "Master any topic with personalized quizzes.",
      "Prepare for specific exams like MDCAT, ECAT & NTS.",
      "Get instant, detailed explanations for tough questions.",
      "Generate study guides and flashcards in seconds.",
    ],
  },
  {
    icon: CheckSquare,
    title: "For Teachers",
    points: [
      "Create professional exam papers with multiple variants.",
      "Generate quizzes from your own notes or documents.",
      "Automate question generation for any subject.",
      "Save hours on creating assessment materials.",
    ],
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
      <div className="flex h-screen w-full items-center justify-center bg-background">
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
        
        <section className="py-16 md:py-24 bg-muted/50">
            <div className="container mx-auto text-center">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How It Works</h2>
                 <p className="max-w-2xl text-muted-foreground mt-4 mx-auto">Transform your study routine in three simple steps.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
                    <Card className="p-6 bg-card border-border/50 shadow-sm">
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
                     <Card className="p-6 bg-card border-border/50 shadow-sm">
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
                     <Card className="p-6 bg-card border-border/50 shadow-sm">
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
                show: { transition: { staggerChildren: 0.1 } },
            }}
        >
            <div className="container mx-auto">
                 <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">The Ultimate Toolkit for Modern Learning</h2>
                     <p className="max-w-3xl text-muted-foreground mt-4 mx-auto">Quizzicallabs AI is more than just a quiz maker. It's a comprehensive suite of intelligent tools designed to support every aspect of your academic journey.</p>
                 </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                         <motion.div variants={cardVariants} key={i}>
                            <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                                    <feature.icon className="h-6 w-6 text-primary"/>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>

        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Who is this for?</h2>
              <p className="max-w-2xl text-muted-foreground mt-4 mx-auto">
                Whether you're a student preparing for exams or a teacher creating them, Quizzicallabs AI has you covered.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {whoIsItFor.map((item, i) => (
                <Card key={i} className="p-6">
                  <CardHeader className="p-0 flex-row items-center gap-4 mb-4">
                     <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                        <item.icon className="h-6 w-6 text-primary"/>
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="space-y-3">
                      {item.points.map((point, j) => (
                        <li key={j} className="flex items-start">
                          <CheckSquare className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" weight="fill" />
                          <span className="text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
         <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Loved by Students and Teachers</h2>
              <p className="max-w-2xl text-muted-foreground mt-4 mx-auto">See what our users are saying about Quizzicallabs AI.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground italic">"This app is a game-changer for MDCAT prep. The chapter-wise tests are exactly what I needed to focus my study."</p>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="https://picsum.photos/50/50?student" alt="Student User" data-ai-hint="student headshot"/>
                        <AvatarFallback>AU</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Ali H.</p>
                        <p className="text-sm text-muted-foreground">MDCAT Student</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
               <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground italic">"The Exam Paper Generator saved me hours of work. Creating multiple versions of a test with an answer key is brilliant!"</p>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="https://picsum.photos/50/50?teacher" alt="Teacher User" data-ai-hint="teacher headshot"/>
                        <AvatarFallback>FK</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Fatima K.</p>
                        <p className="text-sm text-muted-foreground">Physics Teacher</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
               <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground italic">"Being able to upload my own notes and get a quiz from them is incredible. It makes my revision so much more effective."</p>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="https://picsum.photos/50/50?user" alt="University User" data-ai-hint="university student"/>
                        <AvatarFallback>US</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Usman S.</p>
                        <p className="text-sm text-muted-foreground">University Student</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/50">
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
