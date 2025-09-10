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
    description: "Compete in real-time multiplayer quiz battles with friends worldwide. Rise through global leaderboards and unlock achievements!",
    isNew: true,
    badge: "🔥 LIVE",
    gradient: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-600"
  },
  {
    icon: Share2,
    title: "Social Quiz Sharing",
    description: "Share your creative quizzes virally. Build your learning community with engagement tracking and collaborative features.",
    isNew: true,
    badge: "⭐ SOCIAL",
    gradient: "from-blue-500/20 to-purple-500/20",
    iconColor: "text-blue-600"
  },
  {
    icon: BrainCircuit,
    title: "Ultra-Personalized AI",
    description: "AI adapts to your learning pace with smart difficulty levels, performance tracking, and curriculum-aligned content.",
    gradient: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-emerald-600"
  },
  {
    icon: FileArrowUp,
    title: "Document Quiz Generator",
    description: "Upload PDFs, DOCX files, or images. Our AI creates perfect quizzes directly from your study materials instantly.",
    gradient: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-600"
  },
  {
    icon: Trophy,
    title: "Complete Test Prep",
    description: "Full MDCAT/ECAT/NTS preparation with official syllabus coverage, mock exams, and detailed analytics.",
    gradient: "from-yellow-500/20 to-orange-500/20",
    iconColor: "text-yellow-600"
  },
  {
    icon: BookOpen,
    title: "AI Study Guides",
    description: "Instant generation of comprehensive guides with summaries, analogies, key concepts, and built-in assessments.",
    gradient: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-600"
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

const freePlanFeatures = [
    "Unlimited Quizzes & Guides",
    "Standard AI Model",
    "Full Prep Module Access",
    "Contains Ads",
]

const proPlanFeatures = [
    "All Free Features, plus:",
    "Advanced AI Model (gemini-1.5-pro)",
    "Higher Quality & Accuracy",
    "Ad-Free Experience",
    "Priority Support",
]

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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/3 to-secondary/5">
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
            {/* Top Badges */}
            <motion.div
              variants={FADE_IN_ANIMATION_VARIANTS}
              className="flex justify-center gap-4 mb-8 flex-wrap"
            >
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Trophy className="h-4 w-4" />
                10,000+ Students Empowered
              </div>
              <div className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="h-4 w-4" />
                AI-Powered Platform
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
                <Award className="h-4 w-4" />
                Quiz Arena Live
              </div>
            </motion.div>

            {/* Main Hero Content */}
            <div className="text-center mb-12">
              <motion.h1
                variants={FADE_IN_ANIMATION_VARIANTS}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
              >
                Transform <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">3 Hours</span> of Study into
                <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  30 Seconds of Learning
                </span>
              </motion.h1>

              <motion.p
                variants={FADE_IN_ANIMATION_VARIANTS}
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
              >
                Generate custom quizzes, compete in live multiplayer battles, and share educational content virally.
                Join <strong>10,000+ students</strong> already mastering subjects with AI-powered learning.
              </motion.p>

              <motion.div
                variants={FADE_IN_ANIMATION_VARIANTS}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg" asChild>
                  <Link href="/signup">
                    <Zap className="mr-2 h-5 w-5" />
                    Start Free Trial
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 hover:bg-accent/5" asChild>
                  <Link href="/quiz-arena">
                    <GamepadIcon className="mr-2 h-5 w-5" />
                    Try Quiz Arena Live
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Problem/Solution Section */}
            <motion.div className="grid md:grid-cols-2 gap-8 mb-16" variants={FADE_IN_ANIMATION_VARIANTS}>
              <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                <CardContent className="p-8">
                  <div className="text-red-600 mb-4">
                    <Target className="h-12 w-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">❌ The Problem</h3>
                  <ul className="space-y-3 text-red-700 dark:text-red-300">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Students spend 3+ hours creating study materials
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Only 20% retention rate after a week
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Generic quizzes that don't adapt to learning style
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Boring study sessions lead to dropout
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CardContent className="p-8">
                  <div className="text-green-600 mb-4">
                    <Zap className="h-12 w-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">✅ Our Solution</h3>
                  <ul className="space-y-3 text-green-700 dark:text-green-300">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      AI generates complete materials in 30 seconds
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      90% scientifically proven retention rate
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Adaptive difficulty based on your performance
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Quiz Arena makes learning addictive
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Section */}
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12" variants={FADE_IN_ANIMATION_VARIANTS}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
                <div className="text-sm text-muted-foreground">Students Empowerred</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">2K+</div>
                <div className="text-sm text-muted-foreground">Quiz Battles Monthly</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Study Materials Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4.9⭐</div>
                <div className="text-sm text-muted-foreground">Student Rating</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Demo Screenshot */}
        <motion.div
          className="absolute top-20 right-10 hidden xl:block"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="relative">
            <div className="w-80 h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl shadow-2xl border border-white/20 backdrop-blur-sm">
              <div className="p-6 text-center text-white font-semibold">
                Quiz Arena Live Demo
                <br />
                <span className="text-sm opacity-75">Click to see in action</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Pop Quiz Arena Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">🎮 Revolutionary Quiz Arena</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The first <strong>real-time multiplayer quiz platform</strong> where learning meets competition
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
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <GamepadIcon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Live Battles</h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Compete with friends in real-time quiz competitions. See your ranking update instantly as you answer questions with time pressure.
                </p>

                <div className="space-y-4">
                  {[
                    "Real-time leaderboards update live",
                    "Host controls for session management",
                    "Private rooms for class competitions",
                    "Achievement system with badges",
                    "Performance analytics per session"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="mt-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" asChild>
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
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-8 rounded-2xl border border-orange-200 dark:border-orange-800">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">📊 Live Match Stats</h4>
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
                      <span className="text-sm">🏆 Ahmed (1st)</span>
                      <span className="font-semibold">2,450 pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">🤝 Fatima (2nd)</span>
                      <span className="font-semibold">2,320 pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">💎 You (3rd)</span>
                      <span className="font-semibold">2,185 pts</span>
                    </div>
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
                description: "Upload your study materials or select from our curated quiz templates. AI automatically generates personalized content.",
                icon: FileText
              },
              {
                step: "02",
                title: "Learn & Compete",
                description: "Take quizzes individually or challenge friends in real-time multiplayer battles. Get detailed explanations instantly.",
                icon: BrainCircuit
              },
              {
                step: "03",
                title: "Track & Master",
                description: "Monitor progress with detailed analytics, review bookmarked questions, and celebrate achievements.",
                icon: TrendingUp
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative h-full group hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <item.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary mb-2">{item.step}</div>
                        <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="py-16 md:py-24 bg-muted/30"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 variants={FADE_IN_ANIMATION_VARIANTS} className="text-3xl md:text-4xl font-bold mb-4">
              Complete Learning Toolkit
            </motion.h2>
            <motion.p variants={FADE_IN_ANIMATION_VARIANTS} className="max-w-3xl text-muted-foreground mx-auto">
              From quiz generation to competitive battles, we've built the most comprehensive AI-powered learning platform
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const colorSchemes = [
                { bg: 'from-orange-500/20 to-red-500/20', icon: 'text-orange-600', badge: 'bg-orange-500/10 text-orange-600' },
                { bg: 'from-blue-500/20 to-purple-500/20', icon: 'text-blue-600', badge: 'bg-blue-500/10 text-blue-600' },
                { bg: 'from-green-500/20 to-emerald-500/20', icon: 'text-green-600', badge: 'bg-green-500/10 text-green-600' },
                { bg: 'from-cyan-500/20 to-blue-500/20', icon: 'text-cyan-600', badge: 'bg-cyan-500/10 text-cyan-600' },
                { bg: 'from-yellow-500/20 to-orange-500/20', icon: 'text-yellow-600', badge: 'bg-yellow-500/10 text-yellow-600' },
                { bg: 'from-indigo-500/20 to-purple-500/20', icon: 'text-indigo-600', badge: 'bg-indigo-500/10 text-indigo-600' }
              ];
              const scheme = colorSchemes[i % colorSchemes.length];

              return (
                <motion.div
                  variants={cardVariants}
                  key={i}
                  whileHover={hoverVariants.hover}
                >
                  <Card className="relative h-full group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-card via-card to-card/90 backdrop-blur-sm">
                    <div className={`absolute inset-0 bg-gradient-to-br ${scheme.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`} />

                    {feature.badge && (
                      <div className="absolute -top-3 left-4">
                        <Badge className={`${scheme.badge} border-0 shadow-sm`}>
                          {feature.badge}
                        </Badge>
                      </div>
                    )}

                    <CardContent className="p-8 relative z-10">
                      <div className="space-y-6">
                        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${scheme.bg} group-hover:scale-110 transition-transform duration-300`}>
                          <feature.icon className={`h-8 w-8 ${scheme.icon}`} />
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text group-hover:from-foreground group-hover:to-foreground transition-all duration-300">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>

                    <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-background">
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
              <Card className="relative h-full shadow-xl border-2 border-muted">
                <CardHeader className="pb-8">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-3xl font-bold text-foreground">Free</CardTitle>
                    <Badge variant="secondary">Starter Plan</Badge>
                  </div>
                  <CardDescription className="text-base">
                    Perfect foundation for your learning journey
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">$0</span>
                    <span className="text-muted-foreground">/forever</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {freePlanFeatures.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-8" asChild>
                    <Link href="/signup">Get Started Free</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="relative h-full shadow-2xl border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2">
                    🏆 MOST POPULAR
                  </Badge>
                </div>
                <CardHeader className="pb-8">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Pro</CardTitle>
                    <Badge className="bg-gradient-to-r from-primary/20 to-accent/20">Premium Plan</Badge>
                  </div>
                  <CardDescription className="text-base">
                    Unleash the full potential of AI learning
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">$2</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {proPlanFeatures.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" asChild>
                    <Link href="/pricing">Upgrade to Pro</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-muted/30">
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
                  <GamepadIcon className="h-5 w-5" />
                  Try Quiz Arena Live
                </Link>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              ✨ No credit card required • ⚡ Instant setup • 🎯 Join 10,000+ students worldwide
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
