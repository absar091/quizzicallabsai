import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans - Free & Pro | QuizzicalLabzᴬᴵ",
  description: "Choose the perfect plan for your learning needs. Free tier with unlimited quizzes or Pro with advanced AI, private rooms, and detailed analytics. Starting at $2/month.",
  keywords: ["pricing", "plans", "free tier", "pro subscription", "quiz generator pricing", "learning platform cost"],
  openGraph: {
    title: "Pricing Plans - Free & Pro | QuizzicalLabzᴬᴵ",
    description: "Choose the perfect plan for your learning needs. Free tier available with Pro features starting at $2/month.",
    images: ["/og-image.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing Plans - Free & Pro",
    description: "Free tier with unlimited quizzes or Pro with advanced features. Starting at $2/month.",
    images: ["/og-image.svg"],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}