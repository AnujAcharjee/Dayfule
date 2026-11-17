import React from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { StickyFeatureShowcase } from "./components/StickyFeatureShowcase";
import { InteractiveSandbox } from "./components/InteractiveSandbox";
import { ArchitectureHighlights } from "./components/ArchitectureHighlights";
import { DownloadSection } from "./components/DownloadSection";
import { Footer } from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-[#FAFAFA] flex flex-col selection:bg-[#FF6D00]/30 selection:text-white">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        {/* Hero with live device frame */}
        <Hero />

        {/* Scroll-driven Sticky Feature Showcase (Text Left, Dynamic UI Right) */}
        <StickyFeatureShowcase />

        {/* Interactive Web Sandbox / In-Browser Demo */}
        <InteractiveSandbox />

        {/* Architecture & Privacy Highlights */}
        <ArchitectureHighlights />

        {/* Direct APK Download & Mobile QR Code */}
        <DownloadSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
