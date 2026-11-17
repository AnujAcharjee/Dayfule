"use client";

import React from "react";
import { Database, ShieldCheck, BatteryCharging, Code2, Lock, Cpu } from "lucide-react";

export function ArchitectureHighlights() {
  const cards = [
    {
      icon: <Database className="w-5 h-5 text-[#FF6D00]" />,
      title: "100% Offline-First SQLite",
      description:
        "Your data lives securely in local device storage. Instant query responses, zero loading spinners, and complete independence from internet connectivity.",
    },
    {
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      title: "No Accounts. No Tracking.",
      description:
        "No email signups, no analyticsSDKs, and no telemetry. Your personal todos, breaks, and academic schedules belong to you alone.",
    },
    {
      icon: <BatteryCharging className="w-5 h-5 text-[#FFA800]" />,
      title: "Zero Battery Drain",
      description:
        "No background sync services eating your battery. The Android widget updates reactively on task mutation, maintaining minimal resource footprint.",
    },
    {
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      title: "Lightweight Mobile Engine",
      description:
        "Built on React Native 0.88 & Expo SDK 58 with the New Architecture. Smooth 60/120fps animations, haptic feedback, and lean APK size (~28MB).",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      title: "Guilt-Free Habit Psychology",
      description:
        "Break Day and Exam Day tags are engineered to eliminate cognitive fatigue and maintain consistency over entire multi-year journeys.",
    },
    {
      icon: <Code2 className="w-5 h-5 text-pink-400" />,
      title: "MIT Licensed & Open Source",
      description:
        "Inspect the code, contribute features, or self-host your own customized build. Fully open source on GitHub.",
    },
  ];

  return (
    <section id="architecture" className="relative py-20 lg:py-28 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6D00] bg-[#FF6D00]/10 border border-[#FF6D00]/30 px-3 py-1 rounded-full">
            Under The Hood
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3 mb-3">
            Engineered For Speed & Privacy
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            No bloatware, no social feeds, and no artificial subscriptions. Just pure, uncompromised productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/15 hover:bg-white/[0.04] transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {c.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{c.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {c.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
