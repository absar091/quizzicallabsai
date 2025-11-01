import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Arena - Live Multiplayer Learning | QuizzicalLabzᴬᴵ",
  description: "Compete with friends in real-time quiz battles. Join public rooms or create private competitions. Make learning fun with multiplayer quiz games.",
  keywords: ["quiz arena", "multiplayer quiz", "live quiz battles", "competitive learning", "quiz games", "real-time quiz"],
  openGraph: {
    title: "Quiz Arena - Live Multiplayer Learning",
    description: "Compete with friends in real-time quiz battles. Join public rooms or create private competitions.",
    images: ["/og-image.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiz Arena - Live Multiplayer Learning",
    description: "Compete with friends in real-time quiz battles. Make learning fun!",
    images: ["/og-image.svg"],
  },
};

export default function QuizArenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}