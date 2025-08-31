
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    ArrowRight, 
    BotMessageSquare, 
    GraduationCap, 
    FileUp, 
    BookOpen, 
    ClipboardSignature, 
    FileText, 
    UserCheck,
    MessageCircle,
    HelpCircle,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// export const metadata: Metadata = {
//     title: "How to Use Quizzicallabs AI",
//     description: "Your complete guide to mastering the features of Quizzicallabs AI, from custom quizzes to exam preparation.",
// };

const guideTopics = [
  {
    icon: UserCheck,
    title: "Account & Verification",
    description: "Learn how to sign up, verify your email, and troubleshoot login issues.",
    href: "/how-to-use/account-verification",
  },
  {
    icon: BotMessageSquare,
    title: "Generate Custom Quizzes",
    description: "Create personalized tests. Enter any topic, set difficulty, and choose question styles.",
    href: "/how-to-use/custom-quiz",
  },
  {
    icon: BookOpen,
    title: "Practice Questions",
    description: "Generate topic-specific questions with answers and detailed explanations.",
    href: "/how-to-use/practice-questions",
  },
  {
    icon: FileUp,
    title: "Quiz from Document",
    description: "Upload your study materials (PDF, DOCX) to generate a quiz from them.",
    href: "/how-to-use/quiz-from-document",
  },
  {
    icon: FileText,
    title: "AI Study Guide Generator",
    description: "Get comprehensive study guides on any topic with summaries and key concepts.",
    href: "/how-to-use/study-guide",
  },
  {
    icon: ClipboardSignature,
    title: "Exam Paper Generator",
    description: "A tool for educators to create and format professional exam papers with answer keys.",
    href: "/how-to-use/exam-paper-generator",
  },
  {
    icon: GraduationCap,
    title: "Entry Test Preparation",
    description: "Access specialized modules for MDCAT, ECAT, and NTS with mock exams.",
    href: "/how-to-use/entry-test-prep",
  },
  {
    icon: MessageCircle,
    title: "Contact & Support",
    description: "Having trouble? Find out how to get in touch with us for help.",
    href: "/how-to-use/contact-support",
  },
];

export default function HowToUsePage() {
  const router = useRouter();

  return (
    <div className="container py-8 max-w-5xl mx-auto">
       <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4"/>
        Go Back
      </Button>
      <PageHeader
        title="How to Use Quizzicallabs™"
        description="Your complete guide to mastering the features of the ultimate AI study tool."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guideTopics.map((topic, index) => (
          <Link href={topic.href} key={index} className="flex">
            <Card className="flex flex-col w-full hover:border-primary transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
                    <topic.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{topic.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{topic.description}</CardDescription>
              </CardContent>
              <CardContent className="mt-auto">
                <div className="flex items-center text-primary font-semibold text-sm">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
