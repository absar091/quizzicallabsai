
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AppProviders from "@/components/app-providers";
import { ErrorBoundary } from "@/components/error-boundary";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: '--font-sans',
  display: 'swap',
  preload: false
});

const APP_NAME = "Quizzicallabzᴬᴵ";
const APP_DESCRIPTION = "Generate custom quizzes, practice questions with AI explanations, and full study guides. Prepare for MDCAT, ECAT, and NTS with chapter-wise tests and full mock exams. Upload documents to create quizzes, create print-ready exam papers for educators, track performance with analytics, and get instant help from our AI bot. The ultimate study tool for students and educators in Pakistan and beyond.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: "Quizzicallabzᴬᴵ - Your Ultimate AI-Powered Study Partner",
    template: "%s | Quizzicallabzᴬᴵ",
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: "/icon.svg",
    apple: [{ url: "/apple-icon.svg", sizes: "180x180", type: "image/svg+xml" }],
  },
metadataBase: new URL('https://quizzicallabz.qzz.io'),
  verification: {
    google: "m8xmix3Yw61Pyy6JWF91A7ukaR2WTRjD_fYL9TVBRoo",
  },
  openGraph: {
    title: "Quizzicallabzᴬᴵ - The Ultimate AI Study Platform for MDCAT, ECAT & NTS",
    description: "Generate tailored quizzes, practice questions from documents, track your progress, and get AI-powered study guides. Specialized prep for MDCAT, ECAT, and NTS exams. Perfect for students and educators.",
    url: "https://quizzicallabz.qzz.io",
    siteName: "Quizzicallabzᴬᴵ",
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
    title: "Quizzicallabzᴬᴵ - AI-Powered Learning for MDCAT, ECAT & NTS",
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
  keywords: ["quiz generator", "ai quiz maker", "study tool", "practice questions", "mdcat prep", "ecat prep", "nts prep", "mock test", "learning platform", "exam paper generator", "study guide generator", "personalized learning", "ai tutor", "quiz from pdf", "test generator", "Absar Ahmad Rao", "Quizzicallabzᴬᴵ"],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' }
  ],
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", poppins.variable)}>
        <ErrorBoundary>
          <AppProviders>
            {children}
          </AppProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
