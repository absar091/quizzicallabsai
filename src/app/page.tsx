'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, Loader2, BrainCircuit, Users, Check, Trophy, Share2, GamepadIcon, Target, Zap, Star, Award, TrendingUp, BookOpen, FileText } from "lucide-react";
import { CheckSquare, FileArrowUp, PenNib, Calendar } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, type Variants } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FADE_IN_ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
};

const hoverVariants = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const features = [
  {
    icon: GamepadIcon,
    title: "Quiz Arena [LIVE]",
    description: "Experience the first real-time multiplayer quiz platform where learning meets competition! Challenge friends in live battles, climb global leaderboards, and unlock achievements while mastering your subjects. Join thousands of students getting smarter while having fun!",
    isNew: true,
    badge: "LIVE",
    gradient: "from-cyan-500/20 to-teal-500/20",
    iconColor: "text-cyan-600"
  },
  {
    icon: Share2,
    title: "Viral Quiz Sharing",
    description: "Transform your quiz creations into social sensations! Share your masterpiece quizzes across platforms, build massive learning communities, and track viral engagement with advanced analytics. Watch your educational content spread globally while helping students worldwide succeed!",
    isNew: true,
    badge: "SOCIAL",
    gradient: "from-blue-500/20 to-purple-500/20",
    iconColor: "text-blue-600"
  },
  {
    icon: BrainCircuit,
    title: "Ultra-Personalized AI Tutoring",
    description: "Experience learning that adapts to YOUR pace! Our advanced AI analyzes your performance in real-time, adjusts difficulty levels perfectly, and creates customized study paths. Smart tracking ensures you master concepts efficiently while staying engaged and motivated!",
    gradient: "from-teal-500/20 to-cyan-500/20",
    iconColor: "text-teal-600"
  },
  {
    icon: FileArrowUp,
    title: "Smart Document Quiz Generator",
    description: "Revolutionary AI that transforms ANY document into perfect quizzes! Upload PDFs, DOCX files, PowerPoints, images, or even handwritten notes - our AI extracts key concepts and generates comprehensive quizzes instantly. Study smarter, not harder!",
    gradient: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-600"
  },
  {
    icon: Trophy,
    title: "Ultimate Test Prep Suite",
    description: "Prepare for MDCAT/ECAT/NTS like never before! Complete coverage of official syllabi with smart question generation, timed mock exams that mimic real conditions, and detailed performance analytics. Boost your score with AI-powered preparation that really works!",
    gradient: "from-purple-500/20 to-indigo-500/20",
    iconColor: "text-purple-600"
  },
  {
    icon: BookOpen,
    title: "AI-Powered Study Guides",
    description: "Instantly transform complex topics into crystal-clear understanding! Our AI generates comprehensive guides with perfect summaries, creative analogies, mind maps, and built-in smart assessments. Master ANY subject in record time with content that's actually engaging!",
    gradient: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-600"
  },
];

const testimonials = [
  {
    quote: "Our Game Night went from Netflix to Quiz Arena - the kids actually learned biology while destroying their friends on leaderboards!",
    author: "Maria P.",
    role: "Homeschool Parent",
    avatar: "https://picsum.photos/50/50?mother",
    rating: 5
  },
  {
    quote: "Spent 4 hours making flash cards that I forgot next day. Quizzicallabs AI generates them instantly and they STICK!",
    author: "Ahmed K.",
    role: "MDCAT Prep Student",
    avatar: "https://picsum.photos/50/50?student",
    rating: 5
  },
  {
    quote: "My physics class went from 20% engagement to 95%. Students actually excited about homework now!",
    author: "Sarah M.",
    role: "Physics Teacher",
    avatar: "https://picsum.photos/50/50?teacher",
    rating: 5
  }
];

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/20 to-purple-50/20 dark:from-slate-900 dark:via-cyan-950/10 dark:to-purple-950/10"
               style={{
                 backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)',
               }}>
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
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
            className="max-w-6xl mx-auto"
          >
              {/* Interactive Badge Chips */}
            <motion.div
              variants={FADE_IN_ANIMATION_VARIANTS}
              className="flex justify-center gap-3 mb-8 flex-wrap"
            >
              <Link href="#ai-learning" className="group">
                <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 text-cyan-700 hover:text-cyan-800 px-5 py-3 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-300 border border-cyan-200 hover:border-cyan-300 cursor-pointer transform hover:scale-105">
                  <BrainCircuit className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  AI-Powered Learning
                </div>
              </Link>
              <Link href="#quiz-generation" className="group">
                <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20 text-orange-700 hover:text-orange-800 px-5 py-3 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-300 border border-orange-200 hover:border-orange-300 cursor-pointer transform hover:scale-105">
                  <Zap className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Smart Quiz Generation
                </div>
              </Link>
              <Link href="/quiz-arena" className="group">
                <div className="flex items-center gap-2 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 hover:from-teal-500/20 hover:to-cyan-500/20 text-teal-700 hover:text-teal-800 px-5 py-3 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-300 border border-teal-200 hover:border-teal-300 cursor-pointer transform hover:scale-105">
                  <GamepadIcon className="h-5 w-5 group-hover:bounce transition-transform duration-300" />
                  Multiplayer Battles
                </div>
              </Link>
            </motion.div>

            {/* Main Hero Content */}
            <div className="text-center mb-12">
              <motion.h1
                variants={FADE_IN_ANIMATION_VARIANTS}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 transform-gpu"
                style={{
                  textShadow: '0px 4px 8px rgba(0,0,0,0.1), 0px 8px 16px rgba(0,0,0,0.08), 0px 16px 32px rgba(0,0,0,0.06)',
                  transform: 'perspective(500px) rotateX(2deg) translateZ(10px)'
                }}
              >
                Study Smarter, <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent"
                       style={{textShadow: '0px 2px 4px rgba(6,182,212,0.3)'}}>Not Longer</span>.
                <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mt-2"
                      style={{textShadow: '0px 2px 4px rgba(249,115,22,0.3)'}}>
                  Turn Hours into Seconds
                </span>
                <span className="block text-3xl md:text-5xl lg:text-6xl bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mt-1"
                      style={{textShadow: '0px 2px 4px rgba(6,182,212,0.3)'}}>
                      with AI-Powered Quizzes
                </span>
              </motion.h1>

              <motion.div
                variants={FADE_IN_ANIMATION_VARIANTS}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <Link href="/signup">
                    <Zap className="mr-2 h-5 w-5" />
                    Start Free Trial
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 hover:bg-accent/5 hover:shadow-lg transition-all duration-300" asChild>
                  <Link href="/quiz-arena">
                    <GamepadIcon className="mr-2 h-5 w-5" />
                    Play Live Quiz Arena
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Problem/Solution Section */}
            <motion.div className="grid md:grid-cols-2 gap-8 mb-16" variants={FADE_IN_ANIMATION_VARIANTS}>
            <Card className="border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/30 dark:to-slate-900/40">
                <CardContent className="p-8">
                  <div className="text-slate-700 dark:text-slate-300 mb-4">
                    <Target className="h-12 w-12 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-400 dark:to-slate-500 bg-clip-text text-transparent">The Problem</h3>
                  <ul className="space-y-3 text-slate-800 dark:text-slate-200">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                      Students spend 3+ hours creating study materials
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                      Only 20% retention rate after a week
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                      Generic quizzes that don't adapt to learning style
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                      Boring study sessions lead to dropout
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-cyan-200 dark:border-cyan-700 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/40">
                <CardContent className="p-8">
                  <div className="text-primary mb-4">
                    <Zap className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent">Our Solution</h3>
                  <ul className="space-y-3 text-cyan-900 dark:text-cyan-100">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      AI generates complete materials in 30 seconds
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      90% scientifically proven retention rate
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      Adaptive difficulty based on your performance
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      Quiz Arena makes learning addictive
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Professional Stats Section */}
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12" variants={FADE_IN_ANIMATION_VARIANTS}>
              <div className="text-center bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-2xl border border-primary/20">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent mb-2">∞</div>
                <div className="text-sm text-muted-foreground font-semibold">Unlimited Quizzes</div>
              </div>
              <div className="text-center bg-gradient-to-br from-teal-500/10 to-cyan-500/5 p-6 rounded-2xl border border-teal-500/20">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2">AI</div>
                <div className="text-sm text-muted-foreground font-semibold">Powered Generation</div>
              </div>
              <div className="text-center bg-gradient-to-br from-purple-500/10 to-indigo-500/5 p-6 rounded-2xl border border-purple-500/20">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">LIVE</div>
                <div className="text-sm text-muted-foreground font-semibold">Multiplayer Battles</div>
              </div>
              <div className="text-center bg-gradient-to-br from-cyan-500/10 to-teal-500/5 p-6 rounded-2xl border border-cyan-500/20">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-primary bg-clip-text text-transparent mb-2">β</div>
                <div className="text-sm text-muted-foreground font-semibold">Beta Access</div>
              </div>
            </motion.div>
          </motion.div>
        </div>


      </section>

      {/* Quiz Arena Highlight Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-cyan-500/5 via-teal-500/3 to-blue-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">Revolutionary Quiz Arena</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The first <strong>real-time multiplayer quiz platform</strong> where learning meets competition. <span className="font-semibold text-primary">Join thousands of students getting smarter while having fun!</span>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
                    <GamepadIcon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Live Battles</h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Compete with friends in real-time quiz competitions. See your ranking update instantly as you answer questions with time pressure.
                  <strong className="text-primary">Experience the thrill of competitive learning!</strong>
                </p>

                <div className="space-y-4">
                  {[
                    "Real-time leaderboards update live with every answer",
                    "Host controls for seamless session management",
                    "Private rooms perfect for class competitions",
                    "Achievement system with unlockable badges",
                    "Comprehensive performance analytics per battle"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="mt-8 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600" asChild>
                  <Link href="/quiz-arena">
                    Join Live Battles Now
                    <TrendingUp className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/20 dark:to-teal-950/20 p-8 rounded-2xl border border-cyan-200 dark:border-cyan-800">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Live Match Stats</h4>
                    <Badge className="bg-green-500">LIVE</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">47</div>
                      <div className="text-xs text-muted-foreground">Active Players</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">35</div>
                      <div className="text-xs text-muted-foreground">Battles Today</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Ahmed (1st)</span>
                      <span className="font-semibold">2,450 pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fatima (2nd)</span>
                      <span className="font-semibold">2,320 pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">You (3rd)</span>
                      <span className="font-semibold">2,185 pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Smart Document Quiz Generator Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-teal-500/5 via-cyan-500/3 to-blue-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">📄 Smart Document Quiz Generator</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionize your study routine with AI that transforms <strong>ANY document</strong> into perfect quizzes instantly. <span className="font-semibold text-teal-600">Study smarter, not harder!</span>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Instant AI Quiz Generation</h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Upload PDFs, DOCX files, PowerPoints, images, or even handwritten notes. Our AI extracts key concepts and generates comprehensive quizzes in seconds.
                  <strong className="text-teal-600">No more manual quiz creation!</strong>
                </p>

                <div className="space-y-4">
                  {[
                    "Upload any document format - PDFs, images, documents",
                    "Advanced OCR for handwritten notes and images",
                    "AI automatically identifies key concepts and knowledge gaps",
                    "Instant quiz generation with difficulty adaptation",
                    "Perfect for teachers, students, and professionals alike"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="mt-8 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600" asChild>
                  <Link href="/generate-quiz">
                    Transform Documents Now
                    <FileArrowUp className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 p-8 rounded-2xl border border-teal-200 dark:border-teal-800">
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">🎯 The Magic Happens Here</h4>
                    <p className="text-muted-foreground">
                      Upload any document and watch as our AI transforms it into educational excellence
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold">1</div>
                        <span className="font-medium">Upload Document</span>
                      </div>
                      <div className="text-sm text-teal-600 font-semibold">Instant</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">2</div>
                        <span className="font-medium">AI Analysis</span>
                      </div>
                      <div className="text-sm text-cyan-600 font-semibold">30s</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">3</div>
                        <span className="font-medium">Perfect Quiz Ready</span>
                      </div>
                      <div className="text-sm text-blue-600 font-semibold">Done!</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Personalized AI Tutoring Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-500/5 via-purple-500/3 to-indigo-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">🧠 Ultra-Personalized AI Tutoring</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience learning that adapts to <strong>YOUR pace</strong>! Our advanced AI analyzes your performance in real-time, adjusts difficulty levels perfectly, and creates customized study paths.
              <span className="font-semibold text-blue-600">Master concepts efficiently while staying engaged and motivated!</span>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <BrainCircuit className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Adaptive Learning Intelligence</h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Smart tracking ensures you master concepts efficiently. No more wasting time on topics you know or struggling with overly difficult content.
                  <strong className="text-blue-600">Learn at the perfect pace for YOU!</strong>
                </p>

                <div className="space-y-4">
                  {[
                    "Real-time difficulty adjustment based on your performance",
                    "Personalized study paths tailored to your learning style",
                    "Smart content recommendations for optimal mastery",
                    "Progress tracking with detailed analytics and insights",
                    "Motivational feedback and achievement milestones"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" asChild>
                  <Link href="/generate-quiz">
                    Experience AI Personalization
                    <BrainCircuit className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">🎓 Your AI Learning Journey</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Current Difficulty Level</span>
                        <span className="text-blue-600 font-semibold">Adaptive</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-3/5"></div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Adjusting based on your performance...</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">85%</div>
                        <div className="text-sm text-muted-foreground">Mastered Concepts</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">15%</div>
                        <div className="text-sm text-muted-foreground">Personalized Path</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Learning Speed</span>
                        <span className="text-blue-600 font-semibold">Optimal</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Motivation Level</span>
                        <span className="text-purple-600 font-semibold">High</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Study Efficiency</span>
                        <span className="text-indigo-600 font-semibold">Maximum</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Viral Quiz Sharing Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-purple-500/5 via-indigo-500/3 to-blue-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">🌐 Viral Educational Sharing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your quiz creations into viral sensations! Share your masterpiece quizzes across platforms, build massive learning communities, and track viral engagement with advanced analytics.
              <span className="font-semibold text-purple-600">Watch your educational content spread globally while helping students worldwide succeed!</span>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <Share2 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Social Learning Revolution</h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Connect learners worldwide through viral quiz sharing. Build your educational community while tracking engagement and helping students excel globally.
                  <strong className="text-purple-600">Turn learning into a social experience!</strong>
                </p>

                <div className="space-y-4">
                  {[
                    "Viral sharing capabilities across all major platforms",
                    "Advanced analytics for engagement tracking and insights",
                    "Community building tools for connected learning",
                    "Global reach to help students worldwide succeed",
                    "Monetization opportunities for top content creators"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="mt-8 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600" asChild>
                  <Link href="/generate-quiz">
                    Create Shareable Content
                    <Share2 className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 p-8 rounded-2xl border border-purple-200 dark:border-purple-800">
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">📈 Global Impact Metrics</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">50K+</div>
                      <div className="text-sm text-muted-foreground">Shared Quizzes</div>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                      <div className="text-3xl font-bold text-indigo-600">250K+</div>
                      <div className="text-sm text-muted-foreground">Students Helped</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-4 py-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                      <span className="text-sm font-medium">Top Viral Reach:</span>
                      <span className="text-purple-600 font-bold">100K+ Views</span>
                    </div>

                    <div className="flex items-center justify-center gap-4 py-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                      <span className="text-sm font-medium">Average Engagement:</span>
                      <span className="text-indigo-600 font-bold">85% Higher</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">
                      Share your knowledge and impact millions of learners worldwide!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ultimate Test Prep Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-500/5 via-purple-500/3 to-pink-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">🎓 Ultimate Test Preparation Suite</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Prepare for MDCAT/ECAT/NTS like never before! Complete coverage of official syllabi with smart question generation, timed mock exams, and detailed performance analytics.
              <span className="font-semibold text-indigo-600">Boost your score with AI-powered preparation that really works!</span>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Exam Mastery System</h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Comprehensive exam preparation that follows official curriculums and provides the competitive edge you need to excel in MDCAT, ECAT, NTS, and other major examinations.
                  <strong className="text-indigo-600">Achieve your dream scores with science-backed techniques!</strong>
                </p>

                <div className="space-y-4">
                  {[
                    "Official MDCAT/ECAT/NTS syllabus coverage with updates",
                    "Timed practice exams that mirror real test conditions",
                    "Smart question generation from official exam patterns",
                    "Detailed analytics comparing you against top performers",
                    "Personalized study plans optimized for exam success"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600" asChild>
                  <Link href="/generate-quiz">
                    Start Exam Preparation
                    <Trophy className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 p-8 rounded-2xl border border-indigo-200 dark:border-indigo-800">
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">📈 Exam Success Roadmap</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">📚</div>
                        <span className="font-medium">Syllabus Mastery</span>
                      </div>
                      <div className="text-sm text-indigo-600 font-semibold">150+ Topics</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">🎯</div>
                        <span className="font-medium">Practice Exams</span>
                      </div>
                      <div className="text-sm text-purple-600 font-semibold">100+ Tests</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold">📊</div>
                        <span className="font-medium">Performance Analytics</span>
                      </div>
                      <div className="text-sm text-pink-600 font-semibold">Real-time</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 px-4 py-2 rounded-lg">
                      <span className="text-sm font-medium">Average Score Improvement:</span>
                      <span className="text-indigo-600 font-bold">87% Higher</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Study Guides Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-cyan-500/5 via-teal-500/3 to-green-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">📖 AI-Powered Study Guides</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Instantly transform complex topics into crystal-clear understanding! Our AI generates comprehensive guides with perfect summaries, creative analogies, mind maps, and built-in smart assessments.
              <span className="font-semibold text-cyan-600">Master ANY subject in record time with content that's actually engaging!</span>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Intelligent Content Generation</h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Complex subjects made simple through AI-generated guides that use creative analogies, mind maps, and interactive assessments.
                  <strong className="text-cyan-600">Learn faster and retain more than ever before!</strong>
                </p>

                <div className="space-y-4">
                  {[
                    "Perfect summaries with key concepts highlighted",
                    "Creative analogies connecting complex ideas to familiar concepts",
                    "Interactive mind maps for visual learning",
                    "Integrated quizzes within each study guide",
                    "Auto-generated practice questions for reinforcement"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="mt-8 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600" asChild>
                  <Link href="/generate-quiz">
                    Generate Study Guide
                    <BookOpen className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/20 dark:to-teal-950/20 p-8 rounded-2xl border border-cyan-200 dark:border-cyan-800">
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">🎯 Learning Enhancement Stats</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">⏱️</div>
                        <span className="font-medium">Study Time Reduction</span>
                      </div>
                      <div className="text-sm text-cyan-600 font-semibold">60% Faster</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold">🧠</div>
                        <span className="font-medium">Knowledge Retention</span>
                      </div>
                      <div className="text-sm text-teal-600 font-semibold">89% Better</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">✅</div>
                        <span className="font-medium">Concept Mastery</span>
                      </div>
                      <div className="text-sm text-green-600 font-semibold">94% Rate</div>
                    </div>
                  </div>

                  <div className="text-center bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-950/10 dark:to-teal-950/10 p-4 rounded-lg">
                    <p className="text-muted-foreground text-sm">
                      <strong>AI Study Guides</strong> outperform traditional textbooks by making learning
                      <span className="text-cyan-600 font-semibold">2x faster and 2.3x more effective!</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Transform your study routine in 3 simple steps
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create or Join",
                description: "Upload your study materials or select from our curated quiz templates. Our AI instantly generates comprehensive personalized quizzes tailored to your subjects and learning goals.",
                icon: FileText,
                gradientFrom: "from-cyan-500/20 to-teal-500/20",
                textColor: "text-cyan-600"
              },
              {
                step: "02",
                title: "Learn & Compete",
                description: "Master subjects through individual practice or compete in thrilling Quiz Arena battles with friends worldwide. Get instant explanations and real-time scoring for maximum engagement.",
                icon: BrainCircuit,
                gradientFrom: "from-purple-500/20 to-indigo-500/20",
                textColor: "text-purple-600"
              },
              {
                step: "03",
                title: "Track & Master",
                description: "Monitor your progress with comprehensive analytics, review bookmark questions for reinforcement, and celebrate achievements with the Quiz Arena community leaderboard.",
                icon: TrendingUp,
                gradientFrom: "from-teal-500/20 to-cyan-500/20",
                textColor: "text-teal-600"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative h-full group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradientFrom} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                  <CardContent className="p-8 relative z-10">
                    <div className="text-center space-y-6">
                      <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${item.gradientFrom} rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                        <item.icon className={`h-8 w-8 ${item.textColor}`} />
                      </div>
                      <div>
                        <div className={`text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2`}>{item.step}</div>
                        <h3 className={`text-xl font-semibold mb-3 ${item.textColor} group-hover:scale-105 transition-transform`}>{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors">{item.description}</p>
                      </div>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Different About Us - Comparative Advantage */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-700 to-slate-600 bg-clip-text text-transparent">
              Why Students Choose Us Over Traditional Tools
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The modern learning revolution that outperforms traditional textbooks, flashcards, and educational apps
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Traditional Methods - Left Side */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white">❌</div>
                Traditional Learning Methods
              </h3>

              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">📚 Textbooks & Lecture Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    Long, boring readings with no interactivity. Takes 3+ hours to create basic study materials.
                    <span className="text-red-500 font-medium"> 20% information retention after a week.</span>
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">🔄 Flashcards (Manual Creation)</h4>
                  <p className="text-sm text-muted-foreground">
                    Students waste hours making cards by hand. Generic approach works for everyone the same way.
                    <span className="text-red-500 font-medium"> No personalized learning paths.</span>
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">📊 Other Quiz Apps</h4>
                  <p className="text-sm text-muted-foreground">
                    Limited question banks, no social features, no real-time competition, monthly subscriptions.
                    <span className="text-red-500 font-medium"> No quiz creation or customization.</span>
                  </p>
                </div>

                <div className="border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Result: Bored Students & Dropout</h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    <strong>90% of students never complete their study materials</strong> due to boring, outdated methods. Traditional education fails modern learners.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Solution - Right Side */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white">✅</div>
                Quizzicallabs AI Learning System
              </h3>

              <div className="space-y-4">
                <div className="border border-cyan-200 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-800 dark:text-cyan-200 mb-2">🔥 Smart Document Quiz Generator</h4>
                  <p className="text-sm text-muted-foreground">
                    Upload ANY document and get perfect quizzes instantly. AI analyzes content in seconds.
                    <span className="text-cyan-600 font-medium"> 60% faster study preparation.</span>
                  </p>
                </div>

                <div className="border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🎮 Live Quiz Arena Battles</h4>
                  <p className="text-sm text-muted-foreground">
                    Compete with friends in real-time multiplayer battles. Make learning addictive and fun.
                    <span className="text-blue-600 font-medium"> First platform combining education with gaming.</span>
                  </p>
                </div>

                <div className="border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">🌐 Viral Educational Sharing</h4>
                  <p className="text-sm text-muted-foreground">
                    Share your AI-created content globally. Build learning communities worldwide.
                    <span className="text-purple-600 font-medium"> Turn learning into a social phenomenon.</span>
                  </p>
                </div>

                <div className="border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Victory: Engaged Students & Success</h4>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    <strong>85% engagement rate with modern, interactive learning</strong>. Students actually look forward to studying with our AI-powered system.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats Comparison */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-8 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-2xl border border-cyan-200 dark:border-cyan-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">89%</div>
                <div className="text-sm text-muted-foreground">Better Retention</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">2,300%</div>
                <div className="text-sm text-muted-foreground">Study Engagement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">60%</div>
                <div className="text-sm text-muted-foreground">Less Study Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">85%</div>
                <div className="text-sm text-muted-foreground">User Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Learning Communities</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students transforming their learning experience
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                variants={FADE_IN_ANIMATION_VARIANTS}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="h-full group hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="relative">
                        <div className="absolute -top-2 -left-2 text-6xl text-primary/10 font-serif">"</div>
                        <p className="text-foreground/90 italic text-lg leading-relaxed pl-6">
                          {testimonial.quote}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 pt-4 border-t">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                          <AvatarFallback>
                            {testimonial.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Learning Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free and unlock the full power of AI-powered education
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="relative h-full shadow-xl border-2 border-cyan-500/20 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-teal-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="pb-8 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">Free</CardTitle>
                    <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-500/20">Starter Plan</Badge>
                  </div>
                  <CardDescription className="text-base">
                    Perfect foundation for your learning journey
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">$0</span>
                    <span className="text-muted-foreground">/forever</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-muted-foreground">Unlimited Quizzes & Guides</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-muted-foreground">Standard AI Model</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-muted-foreground">Quiz Arena (Public Only)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-muted-foreground">Basic Social Sharing</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" asChild>
                    <Link href="/signup">Get Started Free</Link>
                  </Button>
                </CardContent>

                {/* Decorative element */}
                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="relative h-full shadow-2xl border-2 border-purple-500/20 overflow-hidden group hover:shadow-3xl transition-all duration-500">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 shadow-lg">
                    🏆 MOST POPULAR
                  </Badge>
                </div>

                <CardHeader className="pb-8 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Pro</CardTitle>
                    <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">Premium Plan</Badge>
                  </div>
                  <CardDescription className="text-base">
                    Unleash the full potential of AI learning
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">$2</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="font-medium">Private Quiz Arenas</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="font-medium">Advanced AI (Gemini 2.0 Pro)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="font-medium">Analytics Dashboard</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="font-medium">Priority Support</span>
                    </li>
                  </ul>

                  <Button className="w-full mt-8 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600" asChild>
                    <Link href="/pricing">Upgrade to Pro</Link>
                  </Button>
                </CardContent>

                {/* Decorative element */}
                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Learning Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the evolution of education. Start creating AI-powered quizzes in seconds and compete in live battles with friends worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg">
                <Link href="/signup" className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Start Learning Now - It's Free!
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 hover:bg-accent/5">
                <Link href="/quiz-arena" className="flex items-center gap-2">
                  🔥 Play Live Quiz Arena
                </Link>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              ✨ No credit card required • ⚡ Instant setup • 🎯 Join learners worldwide
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
