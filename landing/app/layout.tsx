import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dayfule — Single-Page Year Productivity Tracker & Daily Todos",
  description:
    "Visualize your entire year on a single interactive screen. Track daily habits, protect streaks with Break & Exam modes, and glance at your progress with the Android home screen widget.",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Dayfule — Single-Page Year Productivity Tracker",
    description:
      "Fuel every day. Own your year. Minimalist mobile productivity tracker with streak protection and Android home screen widget.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050507] text-[#FAFAFA] selection:bg-[#FF6D00]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
