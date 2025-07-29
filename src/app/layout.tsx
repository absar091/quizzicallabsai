
import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import CookieConsentBanner from "@/components/cookie-consent-banner";

const roboto = Roboto({ 
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://quizzicallabs.ai'),
  title: {
    default: "Quizzicallabsᴬᴵ - Your Ultimate AI-Powered Study Partner",
    template: "%s | Quizzicallabsᴬᴵ",
  },
  description: "Quizzicallabsᴬᴵ is your ultimate AI-powered study partner. Generate custom quizzes on any topic (up to 55 questions), create practice questions with AI explanations, build quizzes from your own documents, and get comprehensive study guides. Features include a secure authentication system, cross-device support, specialized MDCAT chapter-wise tests, professional exam paper generation, progress tracking with graphs, bookmarking, and PDF exports. Master any subject, instantly.",
  verification: {
    google: "m8xmix3Yw61Pyy6JWF91A7ukaR2WTRjD_fYL9TVBRoo",
  },
  openGraph: {
    title: "Quizzicallabsᴬᴵ - The Ultimate AI Study Platform",
    description: "Generate tailored quizzes, practice questions from documents, track your progress with analytics, and get AI-powered study guides. Perfect for students and educators.",
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
    title: "Quizzicallabsᴬᴵ - AI-Powered Learning Platform",
    description: "Create custom quizzes, practice questions, and study guides in seconds. Track progress, get AI explanations, and prepare for exams like MDCAT.",
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
  keywords: ["quiz generator", "ai quiz maker", "study tool", "practice questions", "mdcat prep", "learning platform", "exam paper generator", "study guide generator", "personalized learning", "ai tutor", "quiz from pdf", "test generator", "Absar Ahmad Rao", "QuizzicalLabs"],
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
      <body className={cn("min-h-screen bg-background font-sans antialiased", roboto.variable)}>
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
