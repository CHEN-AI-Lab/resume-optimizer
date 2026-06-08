import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Optimizer",
  description: "AI-Powered Resume Optimization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
