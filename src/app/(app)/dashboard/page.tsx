import Link from "next/link";
import {
  BotMessageSquare,
  BookOpen,
  FileUp,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const featureCards = [
  {
    icon: BotMessageSquare,
    title: "Custom Quiz",
    description: "Tailor quizzes by topic, difficulty, and length to fit your study needs.",
    href: "/generate-quiz",
    badge: "AI Powered",
  },
  {
    icon: BookOpen,
    title: "Practice Questions",
    description: "Generate practice questions for any subject and topic instantly.",
    href: "/generate-questions",
    badge: "AI Powered",
  },
  {
    icon: FileUp,
    title: "Quiz from Document",
    description: "Upload your study materials (PDF, DOCX) to create a quiz.",
    href: "/generate-from-document",
    badge: "New",
  },
  {
    icon: GraduationCap,
    title: "MDCAT Preparation",
    description: "Specialized subject-wise and mock tests for medical entry exams.",
    href: "/mdcat",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Let's start learning."
      />
      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4 text-center">Recent Activity</h2>
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">No recent activity. Take a quiz to get started!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
