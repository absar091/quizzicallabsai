import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Page - Not for Public Use",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}