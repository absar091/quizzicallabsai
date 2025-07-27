
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
  metadataBase: new URL('https://quizzicallabs.com'), // Replace with your actual domain
  title: {
    default: "Quizzicallabs AI - Your AI-Powered Learning Partner",
    template: "%s | Quizzicallabs AI",
  },
  description: "Generate custom quizzes, practice questions, and study guides with the power of AI. Master any subject, instantly.",
  openGraph: {
    title: "Quizzicallabs AI",
    description: "The ultimate AI-powered platform for quiz generation and personalized learning.",
    url: "https://quizzicallabs.com", // Replace with your actual domain
    siteName: "Quizzicallabs AI",
    images: [
      {
        url: "/og-image.png", // Replace with the path to your Open Graph image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quizzicallabs AI - AI-Powered Learning Platform",
    description: "Create custom quizzes, practice questions, and study guides in seconds.",
    images: ["/og-image.png"], // Replace with the path to your Twitter image
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
  keywords: ["quiz generator", "ai quiz maker", "study tool", "practice questions", "mdcat prep", "learning platform"],
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
