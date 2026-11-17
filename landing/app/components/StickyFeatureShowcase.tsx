"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  CheckCircle2,
  Coffee,
  GraduationCap,
  Smartphone,
  Flame,
  ShieldCheck,
  Zap,
  Sparkles,
} from "lucide-react";
import { DeviceFrame } from "./DeviceFrame";
import { MockupYearGrid } from "./mockups/MockupYearGrid";
import { MockupDayModal } from "./mockups/MockupDayModal";
import { MockupStreakPreservation } from "./mockups/MockupStreakPreservation";
import { MockupWidget } from "./mockups/MockupWidget";

interface FeatureItem {
  id: number;
  tag: string;
  badgeColor: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  bullets: { title: string; desc: string }[];
  component: React.ReactNode;
}

export function StickyFeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  const features: FeatureItem[] = [
    {
      id: 0,
      tag: "Interactive Matrix",
      badgeColor: "text-[#FF6D00] border-[#FF6D00]/30 bg-[#FF6D00]/10",
      icon: <Calendar className="w-4 h-4 text-[#FF6D00]" />,
      title: "Your Entire Year at a Single Glance",
      subtitle: "365-Day Visual Productivity Canvas",
      description:
        "No buried tabs, no endless pagination, and no forgotten resolutions. Dayfule displays all 365 days on a single responsive matrix. Color-coded dots reveal your consistency, momentum, and completion rate in real time.",
      bullets: [
        {
          title: "Comfortable & Compact Modes",
          desc: "Toggle between high-detail cards and compact dot matrix with a single tap.",
        },
        {
          title: "Visual Completion Gradient",
          desc: "Watch cells turn vibrant emerald green as you check off your daily goals.",
        },
        {
          title: "Current Day Halo",
          desc: "Instant glowing beacon showing exactly where you are in the year.",
        },
      ],
      component: <MockupYearGrid />,
    },
    {
      id: 1,
      tag: "Daily Focus",
      badgeColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
      icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
      title: "Daily Focus With Live Progress Ring",
      subtitle: "Real-Time DayLoader & Task Organization",
      description:
        "Tap any day to open the focused daily workbench. The circular DayLoader ring calculates your completion percentage dynamically with every task checked, giving you instant psychological reward.",
      bullets: [
        {
          title: "Circular DayLoader Ring",
          desc: "Real-time 0% to 100% SVG progress gauge inspired by activity rings.",
        },
        {
          title: "Priority Tagging",
          desc: "Color-coded tags (High, Normal, Low) to keep your biggest priorities front and center.",
        },
        {
          title: "Dynamic Keyboard Avoidance",
          desc: "Smoothly shifts inputs above your keyboard so your view is never blocked while typing.",
        },
      ],
      component: <MockupDayModal />,
    },
    {
      id: 2,
      tag: "Guilt-Free Streaks",
      badgeColor: "text-[#FF8DA1] border-[#FF8DA1]/30 bg-[#FF8DA1]/10",
      icon: <ShieldCheck className="w-4 h-4 text-[#FF8DA1]" />,
      title: "Life Happens. Your Streak Shouldn't Die.",
      subtitle: "Smart Break & Exam Day Modes",
      description:
        "Conventional habit trackers destroy weeks of progress when you take a much-needed vacation or study for finals. Dayfule introduces intelligent streak preservation that protects your momentum without guilt.",
      bullets: [
        {
          title: "Break Days (Pink #FF8DA1)",
          desc: "Rest, recharge, or travel with a full pink halo. Your streak stays intact.",
        },
        {
          title: "Exam Days (Yellow #FFD600)",
          desc: "Dedicate your focus to midterms and finals without losing habit consistency.",
        },
        {
          title: "Sustainable Long-Term Motivation",
          desc: "Eliminates the 'all-or-nothing' trap so you stay committed for years, not days.",
        },
      ],
      component: <MockupStreakPreservation />,
    },
    {
      id: 3,
      tag: "Home Screen Widget",
      badgeColor: "text-[#FFA800] border-[#FFA800]/30 bg-[#FFA800]/10",
      icon: <Smartphone className="w-4 h-4 text-[#FFA800]" />,
      title: "Today's Agenda Right On Your Home Screen",
      subtitle: "Clean, Zero-Distraction Android Widget",
      description:
        "Glance at your progress and check off tasks without ever unlocking your app. The Dayfule widget lives right on your Android home screen, syncing instantly with your offline SQLite database.",
      bullets: [
        {
          title: "Minimalist OLED Aesthetic",
          desc: "Pure black card with clean typography that complements any wallpaper.",
        },
        {
          title: "1-Tap In-App Pinning",
          desc: "Pin the widget to your home screen directly from the app settings.",
        },
        {
          title: "Zero Battery Drain",
          desc: "Updates locally on task changes with zero background polling or network requests.",
        },
      ],
      component: <MockupWidget />,
    },
  ];

  // Scroll listener to update active feature dynamically
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.45;

      featureRefs.current.forEach((el, index) => {
        if (!el) return;
        const top = el.offsetTop;
        const height = el.offsetHeight;

        if (scrollPosition >= top && scrollPosition < top + height) {
          setActiveFeature(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="features" className="relative py-20 lg:py-32 border-t border-white/[0.06]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#FF6D00]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold tracking-wide uppercase text-[#FFA800] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Designed For Real Consistency
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Everything you need. <br />
            <span className="bg-gradient-to-r from-[#FFA800] via-[#FF6D00] to-[#FF3D00] bg-clip-text text-transparent">
              Nothing you don&apos;t.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">
            Scroll down to explore how Dayfule turns daily micro-actions into macro year-long results.
          </p>

          {/* Interactive Feature Tab Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {features.map((f, idx) => (
              <button
                key={f.id}
                onClick={() => {
                  setActiveFeature(idx);
                  featureRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeFeature === idx
                    ? "bg-[#FF6D00] text-white shadow-[0_0_15px_rgba(255,109,0,0.4)]"
                    : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10 hover:border-white/20"
                }`}
              >
                {f.icon}
                <span>{f.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Sticky Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start relative">
          {/* Left Column: Feature Story Cards (Scrolls Naturally) */}
          <div className="lg:col-span-7 space-y-28 lg:space-y-40">
            {features.map((feature, idx) => (
              <div
                key={feature.id}
                ref={(el) => {
                  featureRefs.current[idx] = el;
                }}
                className={`p-6 sm:p-8 rounded-3xl border transition-all duration-500 ${
                  activeFeature === idx
                    ? "bg-white/[0.04] border-[#FF6D00]/40 shadow-[0_0_30px_rgba(255,109,0,0.1)]"
                    : "bg-white/[0.01] border-white/[0.06] opacity-60 hover:opacity-100"
                }`}
              >
                {/* Feature Tag */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${feature.badgeColor}`}
                  >
                    {feature.icon}
                    {feature.tag}
                  </span>
                  <span className="text-xs text-zinc-500">Feature 0{idx + 1}</span>
                </div>

                {/* Feature Title */}
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                  {feature.title}
                </h3>
                <div className="text-sm font-semibold text-[#FFA800] mb-4">
                  {feature.subtitle}
                </div>

                {/* Description */}
                <p className="text-zinc-300 text-base leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Bullets */}
                <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                  {feature.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#FF6D00]/20 flex items-center justify-center text-[#FF6D00] text-xs font-bold shrink-0 mt-0.5">
                        ✓
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-100">{b.title}</div>
                        <div className="text-xs text-zinc-400 mt-0.5 leading-normal">{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile-only inline mockup display */}
                <div className="mt-8 pt-6 border-t border-white/[0.08] lg:hidden flex justify-center">
                  <DeviceFrame className="max-w-[280px]">
                    {feature.component}
                  </DeviceFrame>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Sticky Phone Mockup (Desktop / Tablet) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28">
            <div className="relative">
              {/* Outer decorative glow */}
              <div className="absolute inset-0 bg-[#FF6D00]/15 rounded-full blur-[90px] scale-90 pointer-events-none" />

              {/* Dynamic device frame that displays active feature UI */}
              <div className="relative z-10 transition-all duration-500 ease-out transform">
                <DeviceFrame>
                  {features[activeFeature].component}
                </DeviceFrame>
              </div>

              {/* Active feature indicator under phone */}
              <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 bg-black/60 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#FF6D00] animate-pulse" />
                  Showing: <strong className="text-white">{features[activeFeature].tag}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
