'use client';

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { 
  Loader2, 
  BrainCircuit, 
  Check, 
  Trophy, 
  Share2, 
  GamepadIcon, 
  Zap, 
  TrendingUp, 
  BookOpen, 
  FileText,
  ArrowRight,
  Sparkles,
  Users,
  BarChart3,
  Star,
  Play,
  Shield,
  Rocket,
  Target
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const handleNavigation = useCallback((path: string, buttonText: string, e?: React.MouseEvent) => {
    if (navigatingTo) return;
    e?.preventDefault();
    setNavigatingTo(path);
    toast({
      title: ` Taking you there...`,
      description: `Navigating to ${buttonText}`,
      duration: 800,
    });
    router.push(path);
    setNavigatingTo(null);
  }, [navigatingTo, router, toast]);

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
      {/* Modern Minimalist Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <BrainCircuit className="h-5 w-5 text-white" />
              </div>
              <span className="text-foreground font-bold text-xl">
                Quizzicallabz<sup className="text-accent text-xs">AI</sup>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/#features">Features</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/pricing">Pricing</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/about-us">About</Link>
              </Button>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent shadow-lg" asChild>
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Revolutionary Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Powered by Quizzicallabz Studio</span>
            </div>

            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
              Turn <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">3 Hours</span> of Study Into{" "}
              <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">30 Seconds</span>
            </h1>

            <p className="mb-10 text-xl text-muted-foreground md:text-2xl max-w-3xl mx-auto">
              AI-powered quiz generation, live multiplayer battles, and social learning that makes studying actually fun
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={(e) => handleNavigation('/signup', 'Sign Up')}
                disabled={!!navigatingTo}
                className="group font-bold text-lg shadow-2xl bg-gradient-to-r from-primary to-accent hover:shadow-primary/50"
              >
                {navigatingTo === '/signup' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Taking you there...
                  </>
                ) : (
                  <>
                    Start Free Trial <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={(e) => handleNavigation('/quiz-arena', 'Quiz Arena')}
                disabled={!!navigatingTo}
                className="font-bold text-lg"
              >
                {navigatingTo === '/quiz-arena' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Try Quiz Arena
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Free Tier</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                10x
              </div>
              <div className="text-sm text-muted-foreground">Faster Quiz Creation</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                90%
              </div>
              <div className="text-sm text-muted-foreground">Retention Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-sm text-muted-foreground">AI Availability</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                ∞
              </div>
              <div className="text-sm text-muted-foreground">Unlimited Quizzes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features - 3 Column Grid */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Why Choose Us</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features that transform how you learn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <Card className="group border-2 hover:border-primary/50 transition-all hover:shadow-xl">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <GamepadIcon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Live Quiz Arena</h3>
                <p className="text-muted-foreground mb-4">
                  Compete in real-time multiplayer battles. Turn studying into an addictive gaming experience with instant scoring and leaderboards.
                </p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link href="/quiz-arena">
                    Try it now <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group border-2 hover:border-primary/50 transition-all hover:shadow-xl">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Smart Document Quiz</h3>
                <p className="text-muted-foreground mb-4">
                  Upload any document and get perfect quizzes instantly. AI analyzes your content and generates comprehensive questions in seconds.
                </p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link href="/generate-quiz">
                    Generate quiz <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group border-2 hover:border-primary/50 transition-all hover:shadow-xl">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">AI Personalization</h3>
                <p className="text-muted-foreground mb-4">
                  Adaptive difficulty that learns from you. Get personalized study paths, smart recommendations, and performance insights.
                </p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link href="/signup">
                    Start learning <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
            {[
              { icon: Trophy, title: "MDCAT/ECAT/NTS Prep", desc: "Official syllabus coverage with timed mock exams" },
              { icon: Share2, title: "Social Sharing", desc: "Share quizzes globally and build your community" },
              { icon: BarChart3, title: "Progress Analytics", desc: "Track performance with detailed insights" },
              { icon: BookOpen, title: "Study Guides", desc: "AI-generated guides with mind maps" },
              { icon: Users, title: "Collaborative Learning", desc: "Study together in real-time" },
              { icon: Target, title: "Achievement System", desc: "Unlock badges and celebrate milestones" }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-xl border bg-card hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">Simple Process</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get Started in <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">3 Easy Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Create or Upload",
                desc: "Choose a topic or upload your study materials. AI instantly understands your content.",
                icon: FileText
              },
              {
                step: "02",
                title: "Learn & Compete",
                desc: "Take quizzes solo or battle friends in Quiz Arena. Get instant feedback and explanations.",
                icon: GamepadIcon
              },
              {
                step: "03",
                title: "Track Progress",
                desc: "Monitor your improvement with analytics. Celebrate achievements and master your subjects.",
                icon: TrendingUp
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <Card className="h-full border-2">
                  <CardContent className="p-8 text-center">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg">
                        {item.step}
                      </div>
                    </div>
                    <div className="mt-8 mb-6 mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Transparent Pricing</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Start Free, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Upgrade When Ready</span>
            </h2>
            <p className="text-xl text-muted-foreground">No credit card required for free plan</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Free Forever</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited quiz generation",
                    "Standard AI model",
                    "Public Quiz Arena",
                    "Basic analytics",
                    "Social sharing"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/signup">Start Free</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-primary/50 shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 px-4 py-1">
                  Most Popular
                </Badge>
              </div>
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">$2</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Everything in Free",
                    "Gemini 2.0 Pro AI",
                    "Private Quiz Arena rooms",
                    "Advanced analytics",
                    "Priority support"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-primary to-accent" asChild>
                  <Link href="/pricing">Upgrade to Pro</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Students Worldwide</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "After using Quizzicallabz AI, my MDCAT score improved 30%. The Quiz Arena made studying actually fun!",
                author: "Fatima H.",
                role: "MDCAT 2024"
              },
              {
                quote: "Spent 4 hours making flash cards that I forgot next day. This app generates them instantly and they STICK!",
                author: "Ahmed K.",
                role: "UET Student"
              },
              {
                quote: "My physics class engagement went from 20% to 95%. Students are excited about homework now!",
                author: "Furqan Ahmad",
                role: "University Of Education"
              }
            ].map((testimonial, i) => (
              <Card key={i} className="border-2">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Transform</span> Your Learning?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of students who are studying smarter, not harder
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={(e) => handleNavigation('/signup', 'Sign Up')}
                disabled={!!navigatingTo}
                className="font-bold text-lg shadow-2xl bg-gradient-to-r from-primary to-accent"
              >
                {navigatingTo === '/signup' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Start Free Trial <Rocket className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-bold text-lg"
                asChild
              >
                <Link href="/quiz-arena">
                  <Play className="mr-2 h-5 w-5" />
                  Try Quiz Arena
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required · Free Tier · Upgrade anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <BrainCircuit className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg">
                  Quizzicallabz<sup className="text-accent text-xs">AI</sup>
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Transforming education with AI-powered learning experiences
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/generate-quiz" className="hover:text-primary transition-colors">Quiz Generator</Link></li>
                <li><Link href="/quiz-arena" className="hover:text-primary transition-colors">Quiz Arena</Link></li>
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="/how-to-use" className="hover:text-primary transition-colors">Guides</Link></li>
                <li><Link href="/about-us" className="hover:text-primary transition-colors">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 Quizzicallabz<sup className="text-accent">AI</sup>. All rights reserved.</p>
            
          </div>
        </div>
      </footer>
    </div>
  );
}
