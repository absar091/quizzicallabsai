'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Head from "next/head";
import { BrainCircuit, Loader2, Zap, GamepadIcon, FileText, Trophy, ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect authenticated users to dashboard with proper navigation
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

  // Show loading while redirecting authenticated users
  if (user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "QuizzicalLabzᴬᴵ",
    "description": "AI-powered learning platform for quiz generation and exam preparation",
    "url": "https://quizzicallabz.qzz.io",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free tier with premium options available"
    },
    "creator": {
      "@type": "Organization",
      "name": "QuizzicalLabzᴬᴵ",
      "url": "https://quizzicallabz.qzz.io"
    }
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <BrainCircuit className="h-5 w-5 text-white" />
              </div>
              <span className="text-foreground font-black text-lg md:text-2xl tracking-tight">
                Quizzicallabz<sup className="text-primary text-xs">ᴬᴵ</sup>
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-semibold" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-primary hover:bg-primary/90 font-semibold px-6 py-2 rounded-xl" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm"
              className="md:hidden text-foreground p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col space-y-4">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-semibold justify-start" asChild>
                  <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                </Button>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-semibold justify-start" asChild>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                </Button>
                <Button className="bg-primary hover:bg-primary/90 font-semibold rounded-xl" asChild>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <h1 className="text-3xl md:text-7xl font-black mb-6 md:mb-8 tracking-tight">
            <span className="text-foreground">Study Smarter with </span>
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Transform any document into personalized quizzes in seconds. 
            Compete with friends in live quiz battles.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 md:px-12 py-4 md:py-6 text-base md:text-lg font-semibold rounded-xl md:rounded-2xl shadow-2xl hover:shadow-primary/30 transform hover:scale-105 transition-all duration-300" asChild>
              <Link href="/signup">
                <Zap className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
                Start Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-border text-foreground hover:bg-muted hover:border-border px-8 md:px-12 py-4 md:py-6 text-base md:text-lg font-semibold rounded-xl md:rounded-2xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300" asChild>
              <Link href="/quiz-arena">
                <GamepadIcon className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
                Play Quiz Arena
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-foreground">
            Everything You Need to Learn Better
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card border border-border hover:border-primary/50 backdrop-blur-xl rounded-2xl md:rounded-3xl transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 group">
              <CardContent className="p-6 md:p-10 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-8 shadow-2xl group-hover:shadow-primary/40 transition-all duration-300">
                  <FileText className="h-8 w-8 md:h-10 md:w-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-6 text-foreground">AI Quiz Generator</h3>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  Upload any document and get instant quizzes. PDF, DOCX, images - we handle it all.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border hover:border-primary/50 backdrop-blur-xl rounded-2xl md:rounded-3xl transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 group">
              <CardContent className="p-6 md:p-10 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-8 shadow-2xl group-hover:shadow-primary/40 transition-all duration-300">
                  <GamepadIcon className="h-8 w-8 md:h-10 md:w-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-6 text-foreground">Live Quiz Battles</h3>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  Compete with friends in real-time. Make studying fun with multiplayer competitions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border hover:border-primary/50 backdrop-blur-xl rounded-2xl md:rounded-3xl transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 group">
              <CardContent className="p-6 md:p-10 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-8 shadow-2xl group-hover:shadow-primary/40 transition-all duration-300">
                  <Trophy className="h-8 w-8 md:h-10 md:w-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-6 text-foreground">Smart Learning</h3>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  AI adapts to your pace. Track progress and get personalized study recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5"></div>
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-foreground">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-6 group">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto text-3xl font-black text-primary-foreground shadow-2xl group-hover:shadow-primary/40 transform group-hover:scale-110 transition-all duration-300">
                1
              </div>
              <h3 className="text-3xl font-bold text-foreground">Upload Content</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Upload your study materials or choose from our templates
              </p>
            </div>

            <div className="space-y-6 group">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto text-3xl font-black text-primary-foreground shadow-2xl group-hover:shadow-primary/40 transform group-hover:scale-110 transition-all duration-300">
                2
              </div>
              <h3 className="text-3xl font-bold text-foreground">AI Creates Quiz</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Our AI generates personalized questions in seconds
              </p>
            </div>

            <div className="space-y-6 group">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto text-3xl font-black text-primary-foreground shadow-2xl group-hover:shadow-primary/40 transform group-hover:scale-110 transition-all duration-300">
                3
              </div>
              <h3 className="text-3xl font-bold text-foreground">Learn & Compete</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Study solo or battle friends in live quiz competitions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Simple Pricing</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Free</h3>
                <div className="text-4xl font-bold mb-6 text-foreground">$0<span className="text-lg text-muted-foreground">/month</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">Unlimited quizzes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">Public quiz battles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">Basic AI model</span>
                  </li>
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                  <Link href="/signup">Get Started Free</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-accent border-2 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Popular
                </span>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Pro</h3>
                <div className="text-4xl font-bold mb-6 text-foreground">$2<span className="text-lg text-muted-foreground">/month</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-foreground">Everything in Free</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-foreground">Private quiz rooms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-foreground">Advanced AI (Gemini 2.0)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-foreground">Detailed analytics</span>
                  </li>
                </ul>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href="/pricing">Upgrade to Pro</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students who study smarter with AI-powered quizzes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-4" asChild>
              <Link href="/signup">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted px-8 py-4" asChild>
              <Link href="/quiz-arena">Try Quiz Arena</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BrainCircuit className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-foreground font-bold">Quizzicallabz<sup className="text-accent">ᴬᴵ</sup></span>
              </div>
              <p className="text-muted-foreground text-sm">
                AI-powered learning that makes studying effective and fun.
              </p>
            </div>

            <div>
              <h4 className="text-foreground font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/generate-quiz" className="text-muted-foreground hover:text-foreground">Quiz Generator</Link></li>
                <li><Link href="/quiz-arena" className="text-muted-foreground hover:text-foreground">Quiz Arena</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="text-muted-foreground hover:text-foreground">Help Center</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
                <li><Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
                <li><Link href="/disclaimer" className="text-muted-foreground hover:text-foreground">Disclaimer</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Quizzicallabz<sup className="text-accent">ᴬᴵ</sup>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}