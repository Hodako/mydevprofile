import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Azizul Hakim - Full Stack Web Developer",
  description: "Portfolio of Azizul Hakim, a Full Stack Web Developer specializing in Node.js, React, PostgreSQL, serverless architectures, AWS, Docker, Kubernetes, Vercel, Render, and Cloudflare.",
  keywords: ["Azizul Hakim", "Web Developer", "Node.js", "React", "PostgreSQL", "Serverless", "AWS", "Docker", "Kubernetes", "Vercel", "Render", "Cloudflare", "Nginx", "Full Stack"],
  authors: [{ name: "Azizul Hakim" }],
  openGraph: {
    title: "Azizul Hakim - Full Stack Web Developer",
    description: "Portfolio showcasing expertise in Node.js, React, PostgreSQL, AWS, Docker, Kubernetes, Vercel, Render, and Cloudflare",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
