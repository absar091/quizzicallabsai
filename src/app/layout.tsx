
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AppProviders from "@/components/app-providers";
import 'katex/dist/katex.min.css';

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
});

const APP_NAME = "Quizzicallabs AI";
const APP_DESCRIPTION = "Generate custom quizzes, practice questions with AI explanations, and full study guides. Prepare for MDCAT, ECAT, and NTS with chapter-wise tests and full mock exams. Upload documents to create quizzes, create print-ready exam papers for educators, track performance with analytics, and get instant help from our AI bot. The ultimate study tool for students and educators in Pakistan and beyond.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: "Quizzicallabsᴬᴵ - Your Ultimate AI-Powered Study Partner",
    template: "%s | Quizzicallabsᴬᴵ",
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    shortcut: "/favicon.ico",
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  metadataBase: new URL('https://quizzicallabs.ai'),
  verification: {
    google: "m8xmix3Yw61Pyy6JWF91A7ukaR2WTRjD_fYL9TVBRoo",
  },
  openGraph: {
    title: "Quizzicallabsᴬᴵ - The Ultimate AI Study Platform for MDCAT, ECAT & NTS",
    description: "Generate tailored quizzes, practice questions from documents, track your progress, and get AI-powered study guides. Specialized prep for MDCAT, ECAT, and NTS exams. Perfect for students and educators.",
    url: "https://quizzicallabs.ai",
    siteName: "Quizzicallabsᴬᴵ",
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
    title: "Quizzicallabsᴬᴵ - AI-Powered Learning for MDCAT, ECAT & NTS",
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
  themeColor: "#0d9488",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
         <link rel="icon" href="/icon-192x192.svg" type="image/svg+xml" sizes="any" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
