import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Page - Development Only",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function TestPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}