
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import CookieConsentBanner from "@/components/cookie-consent-banner";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://quizzicallabs.ai'),
  title: {
    default: "Quizzicallabs AI - Your Ultimate AI-Powered Study Partner",
    template: "%s | Quizzicallabs AI",
  },
  description: "Generate custom quizzes, practice questions, and AI study guides. Prepare for MDCAT, ECAT, and NTS with chapter-wise tests and full mock exams. Upload documents to create quizzes, track performance with analytics, and export materials as PDFs. The ultimate study tool for students and educators.",
  verification: {
    google: "m8xmix3Yw61Pyy6JWF91A7ukaR2WTRjD_fYL9TVBRoo",
  },
  openGraph: {
    title: "Quizzicallabs AI - The Ultimate AI Study Platform for MDCAT, ECAT & NTS",
    description: "Generate tailored quizzes, practice questions from documents, track your progress, and get AI-powered study guides. Specialized prep for MDCAT, ECAT, and NTS exams. Perfect for students and educators.",
    url: "https://quizzicallabs.ai",
    siteName: "Quizzicallabs AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quizzicallabs AI - AI-Powered Learning for MDCAT, ECAT & NTS",
    description: "Create custom quizzes, practice questions, and study guides in seconds. Track progress, get AI explanations, and prepare for exams like MDCAT, ECAT, and NTS.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  keywords: ["quiz generator", "ai quiz maker", "study tool", "practice questions", "mdcat prep", "ecat prep", "nts prep", "mock test", "learning platform", "exam paper generator", "study guide generator", "personalized learning", "ai tutor", "quiz from pdf", "test generator", "Absar Ahmad Rao", "QuizzicalLabs"],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
            <CookieConsentBanner />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

    