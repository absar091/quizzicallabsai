
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, Loader2, BrainCircuit, Users, Check } from "lucide-react";
import { CheckSquare, FileArrowUp, PenNib, BookOpen, Lightbulb } from "@phosphor-icons/react";
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

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      console.log('🏠 MAIN PAGE - REDIRECTING LOGGED IN USER TO DASHBOARD');
      router.replace('/dashboard'); // Redirect to dashboard
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user exists, don't render landing page
  if (user) {
    return null; // Will redirect via useEffect
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
                 <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How It Works</h2>
                    <p className="max-w-2xl text-muted-foreground mt-4 mx-auto">Transform your study routine in three simple steps.</p>
                 </motion.div>
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.15 } },
                    }}
                >
                    <motion.div variants={cardVariants} whileHover="hover" className="group">
                        <Card className="relative p-8 h-full overflow-hidden bg-gradient-to-br from-card via-card to-card/80 border border-border/20 shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardHeader className="p-0 relative z-10">
                                <motion.div 
                                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mb-6 group-hover:scale-110 transition-transform duration-300"
                                    whileHover={{ rotate: 5 }}
                                >
                                    <PenNib className="h-8 w-8 text-primary"/>
                                </motion.div>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-primary/80 tracking-wider uppercase">Step 1</p>
                                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Create</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 mt-6 relative z-10">
                                 <p className="text-muted-foreground leading-relaxed">Choose a tool. Generate a custom quiz from any topic, upload your own notes to create a test, or build a comprehensive study guide.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                     <motion.div variants={cardVariants} whileHover="hover" className="group">
                        <Card className="relative p-8 h-full overflow-hidden bg-gradient-to-br from-card via-card to-card/80 border border-border/20 shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardHeader className="p-0 relative z-10">
                                 <motion.div 
                                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 mb-6 group-hover:scale-110 transition-transform duration-300"
                                    whileHover={{ rotate: -5 }}
                                >
                                    <BrainCircuit className="h-8 w-8 text-accent"/>
                                </motion.div>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-accent/80 tracking-wider uppercase">Step 2</p>
                                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Learn & Practice</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 mt-6 relative z-10">
                                 <p className="text-muted-foreground leading-relaxed">Take the AI-generated quizzes, review detailed explanations for incorrect answers, and study with flashcards to reinforce your knowledge.</p>
                            </CardContent>
                        </Card>
                     </motion.div>
                     <motion.div variants={cardVariants} whileHover="hover" className="group">
                        <Card className="relative p-8 h-full overflow-hidden bg-gradient-to-br from-card via-card to-card/80 border border-border/20 shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardHeader className="p-0 relative z-10">
                               <motion.div 
                                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 mb-6 group-hover:scale-110 transition-transform duration-300"
                                    whileHover={{ rotate: 5 }}
                                >
                                    <GraduationCap className="h-8 w-8 text-emerald-600"/>
                                </motion.div>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-emerald-600/80 tracking-wider uppercase">Step 3</p>
                                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Master</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 mt-6 relative z-10">
                                 <p className="text-muted-foreground leading-relaxed">Track your performance on the dashboard, review bookmarked questions, and tackle full-length mock exams to ace your tests.</p>
                            </CardContent>
                        </Card>
                     </motion.div>
                </motion.div>
            </div>
        </section>

        <motion.section 
            id="features" 
            className="py-16 md:py-24 bg-background"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1 } },
            }}
        >
            <div className="container mx-auto">
                 <div className="text-center mb-12">
                    <motion.h2 variants={FADE_IN_ANIMATION_VARIANTS} className="text-3xl font-bold tracking-tighter sm:text-4xl">The Ultimate Toolkit for Modern Learning</motion.h2>
                    <motion.p variants={FADE_IN_ANIMATION_VARIANTS} className="max-w-3xl text-muted-foreground mt-4 mx-auto">Quizzicallabsᴬᴵ is more than just a quiz maker. It's a comprehensive suite of intelligent tools designed to support every aspect of your academic journey.</motion.p>
                 </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => {
                        const colors = [
                            { bg: 'from-blue-500/20 to-cyan-500/20', icon: 'text-blue-600', accent: 'from-blue-500/5 to-cyan-500/5' },
                            { bg: 'from-purple-500/20 to-pink-500/20', icon: 'text-purple-600', accent: 'from-purple-500/5 to-pink-500/5' },
                            { bg: 'from-emerald-500/20 to-teal-500/20', icon: 'text-emerald-600', accent: 'from-emerald-500/5 to-teal-500/5' },
                            { bg: 'from-orange-500/20 to-red-500/20', icon: 'text-orange-600', accent: 'from-orange-500/5 to-red-500/5' },
                            { bg: 'from-indigo-500/20 to-blue-500/20', icon: 'text-indigo-600', accent: 'from-indigo-500/5 to-blue-500/5' },
                            { bg: 'from-rose-500/20 to-pink-500/20', icon: 'text-rose-600', accent: 'from-rose-500/5 to-pink-500/5' }
                        ];
                        const colorScheme = colors[i % colors.length];
                        
                        return (
                            <motion.div 
                                variants={cardVariants} 
                                key={i} 
                                whileHover={hoverVariants.hover}
                                className="group cursor-pointer"
                            >
                                <Card className="relative p-8 h-full overflow-hidden bg-gradient-to-br from-card via-card to-card/90 border border-border/30 shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-sm">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    <div className="relative z-10 space-y-6">
                                        <motion.div 
                                            className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${colorScheme.bg} group-hover:scale-110 transition-transform duration-300`}
                                            whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                                        >
                                            <feature.icon className={`h-8 w-8 ${colorScheme.icon}`}/>
                                        </motion.div>
                                        <div className="space-y-3">
                                            <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text group-hover:from-foreground group-hover:to-foreground transition-all duration-300">{feature.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">{feature.description}</p>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.section>

        <section id="pricing" className="py-16 md:py-24 bg-muted/50">
            <div className="container mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }} className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Choose Your Plan</h2>
                <p className="max-w-2xl text-muted-foreground mt-4 mx-auto">
                    Start for free and upgrade to unlock the full potential of AI-powered learning.
                </p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <motion.div variants={cardVariants} whileHover={{ y: -5, scale: 1.02 }} className="group">
                        <Card className="relative flex flex-col h-full overflow-hidden bg-gradient-to-br from-card via-card to-card/90 border border-border/30 shadow-lg hover:shadow-xl transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-gray-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardHeader className="relative z-10 pb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Free</CardTitle>
                                    <div className="px-3 py-1 bg-muted rounded-full">
                                        <span className="text-xs font-semibold text-muted-foreground">STARTER</span>
                                    </div>
                                </div>
                                <CardDescription className="text-base leading-relaxed">Perfect for everyday study needs and trying out the platform.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <p className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">$0</p>
                                    <p className="text-muted-foreground">per month, forever</p>
                                </div>
                                <ul className="space-y-4">
                                    {freePlanFeatures.map((feature, i) => (
                                        <motion.li 
                                            key={i} 
                                            className="flex items-center gap-4"
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Check className="h-4 w-4 text-primary"/>
                                            </div>
                                            <span className="text-muted-foreground">{feature}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardContent className="relative z-10 pt-0">
                                <Button asChild className="w-full h-12 text-base font-semibold" variant="outline">
                                    <Link href="/signup">Get Started Free</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={cardVariants} whileHover={{ y: -8, scale: 1.02 }} className="group">
                        <Card className="relative flex flex-col h-full overflow-hidden bg-gradient-to-br from-primary/5 via-card to-accent/5 border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500 ring-1 ring-primary/10">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2 rounded-b-lg text-sm font-bold">
                                    MOST POPULAR
                                </div>
                            </div>
                            <CardHeader className="relative z-10 pb-8 pt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Pro</CardTitle>
                                    <div className="px-3 py-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full">
                                        <span className="text-xs font-semibold text-primary">PREMIUM</span>
                                    </div>
                                </div>
                                <CardDescription className="text-base leading-relaxed">For students and educators who demand the best quality and performance.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <p className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">$2</p>
                                    <p className="text-muted-foreground">per month, cancel anytime</p>
                                </div>
                                <ul className="space-y-4">
                                     {proPlanFeatures.map((feature, i) => (
                                        <motion.li 
                                            key={i} 
                                            className="flex items-center gap-4"
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                                                <Check className="h-4 w-4 text-primary"/>
                                            </div>
                                            <span className="font-medium">{feature}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardContent className="relative z-10 pt-0">
                                <Button asChild className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg">
                                    <Link href="/signup">Upgrade to Pro</Link>
                                </Button>
                            </CardContent>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl opacity-50" />
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }} className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Loved by Students and Teachers</h2>
              <p className="max-w-2xl text-muted-foreground mt-4 mx-auto">See what our users are saying about Quizzicallabsᴬᴵ.</p>
            </motion.div>
            <motion.div 
                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.15 } },
                }}
            >
              <motion.div variants={cardVariants} whileHover={{ y: -5, scale: 1.02 }} className="group">
                  <Card className="relative h-full overflow-hidden bg-gradient-to-br from-card via-card to-card/90 border border-border/30 shadow-lg hover:shadow-xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="pt-8 pb-8 relative z-10">
                      <div className="space-y-6">
                        <div className="relative">
                          <div className="absolute -top-2 -left-2 text-6xl text-primary/10 font-serif">"</div>
                          <p className="text-foreground/90 italic text-lg leading-relaxed pl-6">This app is a game-changer for MDCAT prep. The chapter-wise tests are exactly what I needed to focus my study.</p>
                        </div>
                        <div className="flex items-center gap-4 pt-4 border-t border-border/20">
                          <div className="relative">
                            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                              <AvatarImage src="https://picsum.photos/50/50?student" alt="Student User" data-ai-hint="student headshot"/>
                              <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-600 font-semibold">AH</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">Ali H.</p>
                            <p className="text-sm text-muted-foreground">MDCAT Student</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              </motion.div>
               <motion.div variants={cardVariants} whileHover={{ y: -5, scale: 1.02 }} className="group">
                  <Card className="relative h-full overflow-hidden bg-gradient-to-br from-card via-card to-card/90 border border-border/30 shadow-lg hover:shadow-xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="pt-8 pb-8 relative z-10">
                      <div className="space-y-6">
                        <div className="relative">
                          <div className="absolute -top-2 -left-2 text-6xl text-primary/10 font-serif">"</div>
                          <p className="text-foreground/90 italic text-lg leading-relaxed pl-6">The Exam Paper Generator saved me hours of work. Creating multiple versions of a test with an answer key is brilliant!</p>
                        </div>
                        <div className="flex items-center gap-4 pt-4 border-t border-border/20">
                          <div className="relative">
                            <Avatar className="h-12 w-12 ring-2 ring-purple-500/20">
                              <AvatarImage src="https://picsum.photos/50/50?teacher" alt="Teacher User" data-ai-hint="teacher headshot"/>
                              <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-600 font-semibold">FK</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">Fatima K.</p>
                            <p className="text-sm text-muted-foreground">Physics Teacher</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
               <motion.div variants={cardVariants} whileHover={{ y: -5, scale: 1.02 }} className="group">
                  <Card className="relative h-full overflow-hidden bg-gradient-to-br from-card via-card to-card/90 border border-border/30 shadow-lg hover:shadow-xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="pt-8 pb-8 relative z-10">
                      <div className="space-y-6">
                        <div className="relative">
                          <div className="absolute -top-2 -left-2 text-6xl text-primary/10 font-serif">"</div>
                          <p className="text-foreground/90 italic text-lg leading-relaxed pl-6">Being able to upload my own notes and get a quiz from them is incredible. It makes my revision so much more effective.</p>
                        </div>
                        <div className="flex items-center gap-4 pt-4 border-t border-border/20">
                          <div className="relative">
                            <Avatar className="h-12 w-12 ring-2 ring-emerald-500/20">
                              <AvatarImage src="https://picsum.photos/50/50?user" alt="University User" data-ai-hint="university student"/>
                              <AvatarFallback className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 font-semibold">US</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">Usman S.</p>
                            <p className="text-sm text-muted-foreground">University Student</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
               </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/50">
             <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, amount: 0.5 }} 
                transition={{ duration: 0.5 }}
                className="container mx-auto text-center max-w-3xl"
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Transform Your Learning?</h2>
                <p className="text-muted-foreground mt-4 mx-auto">Create a free account and get instant access to the entire suite of AI-powered study tools. No credit card required.</p>
                 <div className="mt-8">
                     <Button size="lg" asChild>
                        <Link href="/signup">
                            Sign Up for Free
                        </Link>
                    </Button>
                 </div>
            </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
