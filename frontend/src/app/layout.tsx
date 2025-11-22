import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InsightFlow - Project Management",
  description: "Manage your projects, stacks, roadmaps, and tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
