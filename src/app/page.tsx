
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, BrainCircuit, ArrowRight, AlertTriangle, FileText, BotMessageSquare, BarChart2, BookOpen, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: BotMessageSquare,
    title: "Custom Quiz Generation",
    description: "Create tailored quizzes based on topic, difficulty, and question type in seconds.",
  },
  {
    icon: BookOpen,
    title: "AI Study Guides",
    description: "Generate comprehensive study guides for any subject to focus your learning.",
  },
  {
    icon: BarChart2,
    title: "Performance Analytics",
    description: "Track your progress with detailed analytics and identify areas for improvement.",
  },
  {
    icon: FileText,
    title: "Quiz from Document",
    description: "Upload your study materials (PDF, DOCX) and let our AI create a quiz for you.",
  },
];

const howToSteps = [
    {
        icon: CheckCircle,
        title: "Create Your Account",
        description: "Sign up with your email to get started."
    },
    {
        icon: CheckCircle,
        title: "Generate a Quiz or Guide",
        description: "Choose a feature, enter your topic, and let the AI do the work."
    },
    {
        icon: CheckCircle,
        title: "Take the Quiz & Review",
        description: "Test your knowledge and review your results with AI explanations."
    }
]

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user) {
    return null; // or a loading spinner, as the redirect is happening
  }

  return (
    <div className="flex min-h-screen flex-col">
       <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
       <div className="absolute left-0 top-0 -z-10 h-1/3 w-full bg-gradient-to-b from-primary/10 to-transparent"></div>
      <AppHeader />
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center gap-12 py-16 text-center md:py-24">
         
          <div className="flex flex-col items-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                Master Any Subject, <span className="text-primary">Instantly.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Welcome to Quizzicallabs™, the ultimate study tool. Generate, take, and share personalized quizzes to conquer your exams with the power of AI.
              </p>
              <div className="flex gap-4">
                <Button size="lg" asChild>
                  <Link href="/generate-quiz">Create a Quiz <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                 <Button size="lg" variant="outline" asChild>
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>
        </section>

        <section id="features" className="container mx-auto py-16 md:py-24">
            <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <Card key={index} className="text-center bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                            <feature.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
        
        <section id="how-to-use" className="container mx-auto py-16 md:py-24 bg-muted/30 rounded-lg">
             <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {howToSteps.map((step, index) => (
                     <div key={index} className="flex flex-col items-center text-center">
                        <step.icon className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                    </div>
                ))}
             </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
