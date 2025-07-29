
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, UserCheck, BotMessageSquare, BookOpen, FileUp, FileText, ClipboardSignature, GraduationCap, MessageCircle, Mail } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

type GuideContent = {
    title: string;
    description: string;
    icon: React.ElementType;
    content: React.ReactNode;
};

const guideData: Record<string, GuideContent> = {
    "account-verification": {
        title: "Account & Verification",
        description: "How to sign up, verify your email, and troubleshoot login issues.",
        icon: UserCheck,
        content: (
            <div className="space-y-6">
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">1. Creating Your Account</h3>
                    <p>Signing up is easy! Just provide your full name, email, class/grade, and age. This information helps us tailor the learning experience just for you.</p>
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">2. Verifying Your Email (Important!)</h3>
                    <p>After signing up, we'll send a verification email to your inbox. You MUST click the link in that email to verify your account before you can log in.</p>
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Can't find the email?</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc list-inside space-y-1 mt-2">
                                <li><strong>Check your Spam/Junk folder.</strong> Sometimes verification emails get filtered by mistake.</li>
                                <li>Wait a few minutes. It can sometimes take a moment to arrive.</li>
                                <li>If you still have trouble after 10-15 minutes, please try signing up again or contact us.</li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">3. Login Issues After Verification</h3>
                    <p>Sometimes it can take a few minutes for the verification status to sync. If you've verified your email but can't log in immediately, please try these steps:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Wait 2-3 minutes and try logging in again.</li>
                        <li>Refresh the login page.</li>
                        <li>If the problem persists, please <Link href="/how-to-use/contact-support" className="text-primary hover:underline">reach out for help</Link>.</li>
                    </ul>
                </div>
            </div>
        )
    },
    "custom-quiz": {
        title: "Generate Custom Quizzes",
        description: "A detailed guide on using the custom quiz generator for personalized learning.",
        icon: BotMessageSquare,
        content: (
            <div className="space-y-4">
                 <p>The Custom Quiz tool is the heart of Quizzicallabs AI, giving you full control over your learning. It’s perfect for focusing on specific areas you need to improve.</p>
                 <h3 className="font-semibold text-lg text-foreground pt-4">How to Use It:</h3>
                 <ol className="list-decimal list-inside space-y-3">
                     <li><strong>Enter Your Topic:</strong> Be as broad or specific as you want. You can enter "Photosynthesis," or something as detailed as "The Calvin Cycle in C3 plants."</li>
                     <li><strong>Set Difficulty:</strong> Choose from Easy, Medium, Hard, or Master to match your knowledge level.</li>
                     <li><strong>Number of Questions:</strong> Select how many questions you want, from 1 to 55.</li>
                     <li><strong>Question Formats:</strong> Pick "Multiple Choice" for quick recall or "Descriptive" for in-depth understanding. You can select both.</li>
                     <li><strong>Question Styles:</strong> Choose how you want to be tested. "Conceptual" tests your understanding of ideas, while "Numerical" will generate math-based problems.</li>
                     <li><strong>Generate:</strong> Click "Generate Quiz" and let the AI build your personalized test in seconds!</li>
                 </ol>
            </div>
        )
    },
    "practice-questions": {
        title: "Practice Questions",
        description: "Learn how to quickly generate questions with answers and AI explanations.",
        icon: BookOpen,
        content: (
             <div className="space-y-4">
                 <p>This tool is ideal for quick revisions and reinforcing your knowledge on a topic. It provides not just questions and answers, but also detailed AI-powered explanations.</p>
                 <h3 className="font-semibold text-lg text-foreground pt-4">How to Use It:</h3>
                 <ol className="list-decimal list-inside space-y-3">
                     <li><strong>Enter Subject and Topic:</strong> Fill in the subject (e.g., "Physics") and the specific topic(s) (e.g., "Newton's Laws of Motion").</li>
                     <li><strong>Select Difficulty and Type:</strong> Choose the difficulty and question type (e.g., Multiple Choice).</li>
                     <li><strong>Number of Questions:</strong> Decide how many questions you need.</li>
                     <li><strong>Generate:</strong> Click the button to get your set of questions.</li>
                     <li><strong>Review:</strong> For each question, you can reveal the correct answer and a detailed explanation to help you understand the 'why' behind it.</li>
                 </ol>
            </div>
        )
    },
    "quiz-from-document": {
        title: "Quiz from Document",
        description: "Upload your study materials and turn them into a quiz instantly.",
        icon: FileUp,
        content: (
            <div className="space-y-4">
                <p>This is one of the most powerful features. Stop wasting time manually creating questions from your notes. Let our AI do it for you.</p>
                <Alert variant="default" className="bg-blue-500/10 border-blue-500/50">
                    <FileUp className="h-4 w-4 text-blue-600"/>
                    <AlertTitle className="text-blue-700">How it Works</AlertTitle>
                    <AlertDescription className="text-blue-700/80">
                       When you upload a document, the AI reads its content and generates questions *exclusively* based on the information present in that file. It will not use any external knowledge.
                    </AlertDescription>
                </Alert>
                <h3 className="font-semibold text-lg text-foreground pt-4">How to Use It:</h3>
                <ol className="list-decimal list-inside space-y-3">
                    <li><strong>Upload Your File:</strong> Drag and drop or click to upload a PDF, DOC, or DOCX file.</li>
                    <li><strong>Set Quiz Length:</strong> Choose how many questions you want the AI to generate from the document.</li>
                    <li><strong>Generate Quiz:</strong> The AI will process your document and create a multiple-choice quiz.</li>
                    <li><strong>Take the Quiz:</strong> Answer the questions and submit to see your score based on your own material!</li>
                </ol>
            </div>
        )
    },
    "study-guide": {
        title: "AI Study Guide Generator",
        description: "Generate a comprehensive study guide for any topic in seconds.",
        icon: FileText,
        content: (
             <div className="space-y-4">
                 <p>Feeling overwhelmed by a new topic? The AI Study Guide Generator is your personal tutor, breaking down complex subjects into easy-to-understand guides.</p>
                 <h3 className="font-semibold text-lg text-foreground pt-4">What's in a Study Guide?</h3>
                  <ul className="list-disc list-inside space-y-2">
                     <li><strong>Summary:</strong> A high-level overview of the topic.</li>
                     <li><strong>Key Concepts:</strong> The most important terms and ideas, with clear definitions and explanations of their importance.</li>
                     <li><strong>Simple Analogies:</strong> Real-world examples to help you understand complex concepts.</li>
                     <li><strong>Self-Quiz:</strong> A few questions to quickly check your understanding.</li>
                 </ul>
                <h3 className="font-semibold text-lg text-foreground pt-4">How to Use It:</h3>
                <ol className="list-decimal list-inside space-y-3">
                    <li><strong>Enter a Topic:</strong> Provide the subject you want to learn about.</li>
                    <li><strong>(Optional) Add Your Struggles:</strong> Tell the AI what you're finding difficult for a more personalized guide.</li>
                    <li><strong>(Optional) Define Your Learning Style:</strong> Ask for analogies, visual descriptions, etc.</li>
                    <li><strong>Generate Guide:</strong> Get a complete, structured guide ready for you to study.</li>
                </ol>
            </div>
        )
    },
    "exam-paper-generator": {
        title: "Exam Paper Generator",
        description: "A powerful tool for educators to create professional, print-ready exam papers.",
        icon: ClipboardSignature,
        content: (
             <div className="space-y-4">
                 <p>Designed for teachers and educators, this tool automates the tedious process of creating and formatting exam papers. Create multiple versions to prevent cheating and get an answer key automatically.</p>
                <h3 className="font-semibold text-lg text-foreground pt-4">How to Use It:</h3>
                <ol className="list-decimal list-inside space-y-3">
                    <li><strong>Enter Paper Details:</strong> Fill in the school name, class, subject, teacher's name, marks, and time limit.</li>
                    <li><strong>Set Content Details:</strong> Specify the topic, difficulty, number of questions, and question types (MCQs, Descriptive).</li>
                    <li><strong>Choose Variants:</strong> Select how many different versions of the paper you need (e.g., 3 variants: A, B, C).</li>
                    <li><strong>Formatting Options:</strong> Choose to include an answer key, add lines for written answers, and select a single or double-column layout.</li>
                    <li><strong>Generate Paper:</strong> The AI will create all variants of the exam paper.</li>
                    <li><strong>Download as PDF:</strong> Download a professionally formatted PDF, ready for printing.</li>
                </ol>
            </div>
        )
    },
    "entry-test-prep": {
        title: "Entry Test Preparation",
        description: "Specialized modules for MDCAT, ECAT, and NTS.",
        icon: GraduationCap,
        content: (
            <div className="space-y-6">
                <p>Our Entry Test Prep sections are specifically designed to match the syllabus and difficulty of Pakistan's major admission tests.</p>
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">MDCAT Preparation</h3>
                    <p>Access chapter-wise and subtopic-wise tests for Biology, Chemistry, Physics, English, and Logical Reasoning, all based on the official MDCAT syllabus. You can also take a full-length mock test that simulates the real exam experience.</p>
                </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">ECAT Preparation</h3>
                    <p>Practice topic-wise tests for Physics, Mathematics, English, and the optional subjects (Chemistry or Computer Science). A full-length ECAT mock test is also available to test your preparedness.</p>
                </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">NTS Preparation</h3>
                    <p>Prepare for various NAT categories (Pre-Engineering, Pre-Medical, etc.). The module provides tests for the subject portions based on your selected field. You can also take a comprehensive mock test covering all sections (Analytical, Quantitative, Verbal, and Subject).</p>
                </div>
            </div>
        )
    },
     "contact-support": {
        title: "Contact & Support",
        description: "How to get in touch with us if you need help.",
        icon: MessageCircle,
        content: (
             <div className="space-y-4">
                <p>We're here to help you succeed. If you're facing any issues with signing up, logging in, or using the app, please don't hesitate to reach out.</p>
                <Alert variant="default" className="bg-background">
                    <Mail className="h-4 w-4" />
                    <AlertTitle>Get in Touch</AlertTitle>
                    <AlertDescription>
                       The best way to contact us is via WhatsApp for the quickest response.
                       <div className="mt-4 space-y-2 font-semibold">
                            <p>WhatsApp Support: <a href="https://wa.me/923297642797" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+92 329 7642797</a></p>
                            <p>Email: <a href="mailto:Ahmadraoabsar@gmail.com" className="text-primary hover:underline">Ahmadraoabsar@gmail.com</a></p>
                       </div>
                    </AlertDescription>
                </Alert>
            </div>
        )
    },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const guide = guideData[params.slug];
  if (!guide) {
    return {};
  }
  return {
    title: guide.title,
    description: guide.description,
  };
}

export default function GuideDetailPage({ params }: { params: { slug: string } }) {
  const guide = guideData[params.slug];

  if (!guide) {
    notFound();
  }

  const { title, description, icon: Icon, content } = guide;

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shrink-0">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <PageHeader title={title} description={description} className="mb-0" />
      </div>
      <Card>
        <CardContent className="pt-6 text-muted-foreground leading-relaxed">
          {content}
        </CardContent>
      </Card>
    </div>
  );
}
