
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowRight, BotMessageSquare, GraduationCap, FileText, BookOpen, ChalkboardTeacher, Student } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { motion } from "framer-motion";

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

const testimonials = [
  {
    name: "Aisha Khan",
    role: "MDCAT Student",
    avatar: "/avatars/01.png",
    text: "Quizzicallabs AI has been a game-changer for my MDCAT prep. The topic-specific quizzes are incredibly accurate and helped me identify my weak areas. The mock tests are just like the real thing!",
  },
  {
    name: "Mr. Bilal Ahmed",
    role: "Physics Teacher",
    avatar: "/avatars/02.png",
    text: "The Exam Paper Generator is a lifesaver. I can create multiple versions of a test in minutes, complete with an answer key. It has saved me hours of administrative work every week.",
  },
  {
    name: "Fahad Ali",
    role: "ECAT Aspirant",
    avatar: "/avatars/03.png",
    text: "Being able to upload my own notes and get a quiz generated from them is an incredible feature. It makes my study sessions so much more effective and targeted.",
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

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 py-24 text-center md:text-left md:py-32">
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
              className="flex flex-col items-center md:items-start space-y-6"
            >
              <motion.h1 
                variants={FADE_IN_ANIMATION_VARIANTS}
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Your Ultimate <br/> <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Study Partner</span>
              </motion.h1>
              <motion.p 
                 variants={FADE_IN_ANIMATION_VARIANTS}
                 className="max-w-xl text-muted-foreground md:text-xl"
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
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-80 md:h-full rounded-2xl"
            >
                <Image 
                    src="https://picsum.photos/800/600" 
                    alt="An abstract representation of AI in education"
                    data-ai-hint="futuristic learning technology"
                    fill
                    className="object-cover rounded-2xl shadow-xl"
                    priority
                />
            </motion.div>
        </section>
        
        <section className="py-16 md:py-24">
            <div className="container mx-auto text-center">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Built for Success</h2>
                 <p className="max-w-2xl text-muted-foreground mt-4 mx-auto">Whether you're a student aiming for the top or an educator shaping minds, our tools are designed for you.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <Card className="text-left overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <CardHeader>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
                                <Student className="h-6 w-6 text-primary"/>
                            </div>
                            <CardTitle>For Students</CardTitle>
                             <CardDescription>Conquer your exams with personalized tools that adapt to your learning style and syllabus.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="relative h-60 w-full">
                                <Image src="https://picsum.photos/600/400" alt="Student studying with a laptop" data-ai-hint="student studying" fill className="object-cover rounded-lg"/>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="text-left overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                         <CardHeader>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
                                <ChalkboardTeacher className="h-6 w-6 text-primary"/>
                            </div>
                            <CardTitle>For Educators</CardTitle>
                             <CardDescription>Save time and reduce your workload with automated tools for creating and formatting exam papers.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="relative h-60 w-full">
                                <Image src="https://picsum.photos/600/400" alt="Teacher in a classroom" data-ai-hint="teacher classroom" fill className="object-cover rounded-lg"/>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        <section id="features" className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto text-center">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Everything You Need to Succeed</h2>
                 <p className="max-w-2xl text-muted-foreground mt-4 mx-auto">From quick practice sessions to full-length mock exams, our tools are designed to support every step of your learning journey.</p>
                 <div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
                  >
                    {allFeatures.map((feature, index) => (
                        <motion.div
                          key={index} 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
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
                        </motion.div>
                    ))}
                 </div>
            </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
             <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Loved by Students and Teachers</h2>
                <p className="max-w-2xl text-muted-foreground mt-4 mx-auto">Don't just take our word for it. Here's what users are saying about Quizzicallabs AI.</p>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="text-left p-6">
                            <CardContent className="p-0">
                                <p className="text-muted-foreground mb-6 italic">"{testimonial.text}"</p>
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                         <AvatarImage src={`https://i.pravatar.cc/150?u=${testimonial.name}`} alt={testimonial.name} />
                                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            </div>
        </section>

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
