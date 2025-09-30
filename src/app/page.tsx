'use client';

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, Loader2, BrainCircuit, Check, Trophy, Share2, GamepadIcon, Target, Zap, TrendingUp, BookOpen, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Navigation states to prevent multiple clicks and show feedback
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // Enhanced navigation with instant feedback - OPTIMIZED
  const handleNavigation = useCallback((path: string, buttonText: string, e?: React.MouseEvent) => {
    if (navigatingTo) return; // Prevent multiple clicks

    e?.preventDefault();
    setNavigatingTo(path);

    // Show immediate feedback
    toast({
      title: `🚀 Taking you there...`,
      description: `Navigating to ${buttonText}`,
      duration: 800, // Reduced duration for performance
    });

    // Navigate immediately without delay
    router.push(path);
    setNavigatingTo(null);
  }, [navigatingTo, router, toast]);

  // OPTIMIZED: Memoize static data
  const featuresList = useMemo(() => [
    {
      icon: BrainCircuit,
      title: "Personalized Learning",
      description: "Our AI adapts to your learning style and pace, creating custom study plans that optimize your retention and understanding.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: GamepadIcon,
      title: "Live Quiz Battles",
      description: "Challenge friends in real-time multiplayer quizzes. Turn studying into engaging competitions with instant scoring and leaderboards.",
      color: "from-cyan-500 to-teal-500",
    },
    {
      icon: FileText,
      title: "Document Quiz Generator",
      description: "Upload your notes, PDF files, or documents. Our AI automatically generates comprehensive quizzes to test your knowledge.",
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: Share2,
      title: "Social Learning",
      description: "Share your quiz creations with friends and classmates. Learn together through collaborative educational experiences.",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics and insights. See how your study habits improve over time.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: BrainCircuit,
      title: '<span className="text-yellow-600">AI</span>-Powered Insights',
      description: "Get intelligent explanations and study tips based on your quiz performance. Learn what works best for you.",
      color: "from-indigo-500 to-purple-500",
    }
  ], []);

  // OPTIMIZED: State for lazy loading sections
  const [visibleSections, setVisibleSections] = useState({ features: false });

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Observe sections lazily
    const sectionsToObserve = document.querySelectorAll('[data-lazy-section]');
    sectionsToObserve.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Simple Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BrainCircuit className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">Quizzicallabz<sup className="text-yellow-400">AI</sup></span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-900/20 via-slate-900/20 to-blue-900/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge Chips */}
            <div className="flex justify-center gap-3 mb-8 flex-wrap">
              <div className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-5 py-3 rounded-full text-sm font-semibold border border-blue-500/30 backdrop-blur-sm">
                <BrainCircuit className="h-5 w-5" />
                <span className="text-yellow-400">AI</span>-Powered Learning
              </div>
              <div className="flex items-center gap-2 bg-blue-600/20 text-blue-300 px-5 py-3 rounded-full text-sm font-semibold border border-blue-600/30 backdrop-blur-sm">
                <Zap className="h-5 w-5" />
                Smart Quiz Generation
              </div>
              <div className="flex items-center gap-2 bg-blue-700/20 text-blue-300 px-5 py-3 rounded-full text-sm font-semibold border border-blue-700/30 backdrop-blur-sm">
                <GamepadIcon className="h-5 w-5" />
                Multiplayer Battles
              </div>
            </div>

            {/* Main Hero Content */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Study Smarter, <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">Not Longer</span>
              <span className="block bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mt-2">Turn Hours into Seconds</span>
              <span className="block text-3xl md:text-5xl bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mt-1">with <span className="text-yellow-400">AI</span>-Powered Quizzes</span>
            </h1>

            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Transform your study routine with intelligent AI that creates personalized quizzes, tracks your progress, and makes learning competitive and engaging.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={(e) => handleNavigation('/signup', 'Sign Up')}
                disabled={!!navigatingTo}
                className="font-bold text-lg shadow-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4"
              >
                <Zap className="mr-2 h-5 w-5" />
                {navigatingTo === '/signup' ? 'Taking you there...' : 'Start Free Trial'}
              </Button>
              <Button
                size="lg"
                onClick={(e) => handleNavigation('/quiz-arena', 'Quiz Arena')}
                disabled={!!navigatingTo}
                className="font-bold text-lg shadow-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-4"
              >
                <GamepadIcon className="mr-2 h-5 w-5" />
                {navigatingTo === '/quiz-arena' ? 'Loading Arena...' : 'Play Live Quiz Arena'}
              </Button>
            </div>
          </div>
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
                    <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                variant="premium"
                onClick={(e) => handleNavigation('/quiz-arena', 'Quiz Arena')}
                disabled={!!navigatingTo}
                className="font-bold"
              >
                {navigatingTo === '/quiz-arena' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <>
                    Join Live Battles Now
                    <TrendingUp className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 p-8 rounded-2xl border border-primary/20 dark:border-primary/30">
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">📧 Quiz Result Email Reports</h4>
                  <p className="text-muted-foreground">
                    Receive comprehensive quiz performance reports with detailed analysis, personalized recommendations, and learning insights delivered via email.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">📊</div>
                      <span className="font-medium">Performance Analysis</span>
                    </div>
                    <div className="text-sm text-primary font-semibold">Detailed Breakdown</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-accent/5 dark:bg-accent/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-semibold">🎯</div>
                      <span className="font-medium">Personalized Feedback</span>
                    </div>
                    <div className="text-sm text-accent font-semibold">AI-Generated Tips</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-primary/10 dark:bg-primary/15 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">⏰</div>
                      <span className="font-medium">Scheduled Delivery</span>
                    </div>
                    <div className="text-sm text-primary font-semibold">Immediate After Quiz</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Document Quiz Generator Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-teal-500/5 via-cyan-500/3 to-blue-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">📄 Smart Document Quiz Generator</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionize your study routine with AI that transforms <strong>ANY document</strong> into perfect quizzes instantly. <span className="font-semibold text-accent">Study smarter, not harder!</span>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Instant AI Quiz Generation</h3>
              </div>
              <p className="text-lg text-muted-foreground">
                Upload PDFs, DOCX files, PowerPoints, images, or even handwritten notes. Our AI extracts key concepts and generates comprehensive quizzes in seconds.
                <strong className="text-accent">No more manual quiz creation!</strong>
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
                    <div className="w-2 h-2 bg-gradient-to-r from-accent to-primary rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="mt-8 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90" asChild>
                <Link href="/generate-quiz">
                  Transform Documents Now
                </Link>
              </Button>
            </div>

            <div className="bg-gradient-to-br from-accent/5 to-primary/5 dark:from-accent/10 dark:to-primary/10 p-8 rounded-2xl border border-accent/20 dark:border-accent/30">
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">🎯 The Magic Happens Here</h4>
                  <p className="text-muted-foreground">
                    Upload any document and watch as our AI transforms it into educational excellence
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-accent/5 dark:bg-accent/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-semibold">1</div>
                      <span className="font-medium">Upload Document</span>
                    </div>
                    <div className="text-sm text-accent font-semibold">Instant</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">2</div>
                      <span className="font-medium">AI Analysis</span>
                    </div>
                    <div className="text-sm text-primary font-semibold">30s</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-accent/10 dark:bg-accent/15 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-semibold">3</div>
                      <span className="font-medium">Perfect Quiz Ready</span>
                    </div>
                    <div className="text-sm text-accent font-semibold">Done!</div>
                  </div>
                </div>
              </div>
            </div>
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

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">📘</div>
                        <span className="font-medium">Content Adaptation</span>
                      </div>
                      <div className="text-sm text-blue-600 font-semibold">Real-time</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">🎯</div>
                        <span className="font-medium">Difficulty Adjustment</span>
                      </div>
                      <div className="text-sm text-purple-600 font-semibold">Auto-Optimized</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">🏆</div>
                        <span className="font-medium">Achievement Tracking</span>
                      </div>
                      <div className="text-sm text-indigo-600 font-semibold">Comprehensive</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 p-8 rounded-2xl border border-purple-200 dark:border-purple-800">
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">📬 Quiz Sharing Features</h4>
                  <p className="text-muted-foreground">
                    Share your quiz creations and results across social platforms with customizable settings and advanced engagement tracking.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">🖥️</div>
                      <span className="font-medium">Dashboard Sharing</span>
                    </div>
                    <div className="text-sm text-purple-600 font-semibold">Easy Export</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">🎨</div>
                      <span className="font-medium">Custom Branding</span>
                    </div>
                    <div className="text-sm text-indigo-600 font-semibold">Professional Results</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-violet-50 dark:bg-violet-950/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white font-semibold">🔗</div>
                      <span className="font-medium">Direct Links</span>
                    </div>
                    <div className="text-sm text-violet-600 font-semibold">One-Click Share</div>
                  </div>
                </div>
              </div>
            </div>
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

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 p-8 rounded-2xl border border-indigo-200 dark:border-indigo-800">
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">📈 Exam Success Roadmap</h4>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">📚</div>
                      <span className="font-medium">Comprehensive Coverage</span>
                    </div>
                    <div className="text-sm text-indigo-600 font-semibold">Complete Syllabus</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">🎯</div>
                      <span className="font-medium">Exam Practice Mode</span>
                    </div>
                    <div className="text-sm text-purple-600 font-semibold">Timed Sessions</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">📊</div>
                      <span className="font-medium">Progress Tracking</span>
                    </div>
                    <div className="text-sm text-blue-600 font-semibold">Detailed Insights</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Study Guides Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-cyan-500/5 via-teal-500/3 to-green-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">📖 <span className="text-yellow-600">AI</span>-Powered Study Guides</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Instantly transform complex topics into crystal-clear understanding! Our AI generates comprehensive guides with perfect summaries, creative analogies, mind maps, and built-in smart assessments.
              <span className="font-semibold text-cyan-600">Master ANY subject in record time with content that's actually engaging!</span>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
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

            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/20 dark:to-teal-950/20 p-8 rounded-2xl border border-cyan-200 dark:border-cyan-800">
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">📝 Study Guide Features</h4>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">📋</div>
                      <span className="font-medium">Smart Summaries</span>
                    </div>
                    <div className="text-sm text-cyan-600 font-semibold">Key Concepts Only</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold">🔗</div>
                      <span className="font-medium">Visual Mind Maps</span>
                    </div>
                    <div className="text-sm text-teal-600 font-semibold">Interactive Design</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">🎯</div>
                      <span className="font-medium">Built-in Assessments</span>
                    </div>
                    <div className="text-sm text-blue-600 font-semibold">Progress Tracking</div>
                  </div>
                </div>

                <div className="text-center bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-950/10 dark:to-teal-950/10 p-4 rounded-lg">
                  <p className="text-muted-foreground text-sm">
                    <strong>AI generates study materials</strong> 10x faster than manual creation
                    <span className="text-cyan-600 font-semibold">Perfect for last-minute studying!</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Transform your study routine in 3 simple steps
          </p>

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
              <div key={index}>
                <Card className="h-full">
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${item.gradientFrom} rounded-full flex items-center justify-center shadow-lg`}>
                        <item.icon className={`h-8 w-8 ${item.textColor}`} />
                      </div>
                      <div>
                        <div className={`text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2`}>{item.step}</div>
                        <h3 className={`text-xl font-semibold mb-3 ${item.textColor}`}>{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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


        </div>
      </section>

      {/* Key Features Section - OPTIMIZED & LAZY LOADED */}
      <section
        id="features"
        data-lazy-section
        className="py-16 md:py-24 bg-background"
        style={
          visibleSections.features
            ? { opacity: 1, transform: 'translateY(0)' }
            : { opacity: 0, transform: 'translateY(20px)' }
        }
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              Learn Smarter with AI
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the essential features that make studying more effective and engaging
            </p>
          </div>

          {visibleSections.features ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {featuresList.map((feature, index) => {
                const { icon: IconComponent } = feature;
                return (
                  <div key={feature.title} className="group">
                    <Card className="h-full border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950 hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <CardContent className="p-8">
                        <div className="space-y-6">
                          <div className="flex items-center justify-center">
                            <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                          </div>

                          <div className="text-center space-y-3">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>

                        {/* Subtle gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          ) : (
            // Placeholder while loading
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <Card className="h-full border border-gray-200 dark:border-gray-800">
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl mx-auto"></div>
                        <div className="space-y-3">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-3/4"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-5/6"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-4/5"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {/* Feature highlights */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">⚡</div>
                <div className="text-sm font-semibold">Instant Quiz Generation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">🎯</div>
                <div className="text-sm font-semibold">Adaptive Learning</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">🏆</div>
                <div className="text-sm font-semibold">Gamified Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">🧠</div>
                <div className="text-sm font-semibold">AI-Powered Insights</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Learning Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free and unlock the full power of AI-powered education
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div>
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
                <CardContent className="space-y-4">
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
                  <Button className="w-full mt-8 bg-gradient-to-r from-primary to-accent" asChild>
                    <Link href="/signup">Get Started Free</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Pro Plan */}
            <div>
              <Card className="h-full shadow-2xl border-2 border-purple-500/20">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 shadow-lg">
                    🏆 MOST POPULAR
                  </Badge>
                </div>

                <CardHeader className="pb-8">
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

                <CardContent className="space-y-4">
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

                  <Button className="w-full mt-8 bg-gradient-to-r from-purple-500 to-indigo-500" asChild>
                    <Link href="/pricing">Upgrade to Pro</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
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

            {/* Genuine Call-to-Action Elements */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground text-sm mb-2">
                Join thousands of students studying smarter, not longer.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span>🔒 Free to start</span>
                <span>•</span>
                <span>⚡ Instant quiz generation</span>
                <span>•</span>
                <span>🎮 Live multiplayer battles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Footer */}
      <footer className="border-t-2 border-blue-500/30 bg-slate-900/90 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <BrainCircuit className="h-6 w-6 text-white" />
                </div>
                <span className="text-white font-bold text-xl">Quizzicallabz<sup className="text-yellow-400">AI</sup></span>
              </div>
              <p className="text-white/70 text-sm mb-4">Transforming education with AI-powered learning experiences.</p>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                  <span className="text-blue-400 text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                  <span className="text-blue-400 text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                  <span className="text-blue-400 text-xs">in</span>
                </div>
              </div>
            </div>

            {/* Product Section */}
            <div>
              <h4 className="text-white font-semibold mb-4 border-b border-blue-500/20 pb-2">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/generate-quiz" className="text-white/70 hover:text-blue-400 transition-colors">Quiz Generator</Link></li>
                <li><Link href="/quiz-arena" className="text-white/70 hover:text-blue-400 transition-colors">Quiz Arena</Link></li>
                <li><Link href="/study-guides" className="text-white/70 hover:text-blue-400 transition-colors">Study Guides</Link></li>
                <li><Link href="/dashboard" className="text-white/70 hover:text-blue-400 transition-colors">Dashboard</Link></li>
                <li><Link href="/pricing" className="text-white/70 hover:text-blue-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>

            {/* Resources Section */}
            <div>
              <h4 className="text-white font-semibold mb-4 border-b border-blue-500/20 pb-2">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="text-white/70 hover:text-blue-400 transition-colors">Help Center</Link></li>
                <li><Link href="/tutorials" className="text-white/70 hover:text-blue-400 transition-colors">Tutorials</Link></li>
                <li><Link href="/blog" className="text-white/70 hover:text-blue-400 transition-colors">Blog</Link></li>
                <li><Link href="/api-docs" className="text-white/70 hover:text-blue-400 transition-colors">API Docs</Link></li>
                <li><Link href="/community" className="text-white/70 hover:text-blue-400 transition-colors">Community</Link></li>
              </ul>
            </div>

            {/* Company Section */}
            <div>
              <h4 className="text-white font-semibold mb-4 border-b border-blue-500/20 pb-2">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-white/70 hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-white/70 hover:text-blue-400 transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-blue-400 transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="text-white/70 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-white/70 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-blue-500/20 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/70 text-sm">
                © 2025 Quizzicallabz<sup className="text-yellow-400">AI</sup>. All rights reserved. Transforming education, one quiz at a time.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-white/50">Made with</span>
                <span className="text-yellow-400">♥</span>
                <span className="text-white/50">for learners worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
