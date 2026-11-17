"use client";

import React from "react";
import { Download, Flame, Shield, Smartphone, ArrowRight, Sparkles } from "lucide-react";
import { GithubIcon } from "./GithubIcon";
import { DeviceFrame } from "./DeviceFrame";
import { MockupYearGrid } from "./mockups/MockupYearGrid";

export function Hero() {
  const apkDownloadUrl =
    "https://expo.dev/accounts/anujacharjee/projects/dayfule/builds/40f8bf57-db3a-47ef-8b7b-d01a68a3abe1";
  const githubUrl = "https://github.com/AnujAcharjee/Dayfule";

  return (
    <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden hero-glow">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-[#FF6D00]/15 via-[#FFA800]/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Version Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#FF6D00]/30 shadow-[0_0_20px_rgba(255,109,0,0.15)] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#FF6D00] animate-ping" />
              <span className="text-xs font-semibold tracking-wide uppercase text-zinc-300">
                Dayfule v1.0.0 Android Release
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-xs font-medium text-[#FFA800]">Free & Open Source</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
              Fuel every day. <br />
              <span className="bg-gradient-to-r from-[#FFA800] via-[#FF6D00] to-[#FF3D00] bg-clip-text text-transparent">
                Own your entire year.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mb-8 leading-relaxed">
              A minimalist, dark-mode productivity app that maps your 365 days onto a single interactive grid.
              Track daily todos, protect streaks with dedicated <span className="text-[#FF8DA1] font-semibold">Break</span> and <span className="text-[#FFD600] font-semibold">Exam</span> modes, and view today&apos;s progress right from your Android home screen widget.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <a
                href={apkDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6D00] via-[#FF7A00] to-[#E65100] text-white font-bold text-base shadow-[0_0_30px_rgba(255,109,0,0.4)] hover:shadow-[0_0_40px_rgba(255,109,0,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Download className="w-5 h-5" />
                <span>Download APK (v1.0.0)</span>
              </a>

              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] text-zinc-200 hover:text-white font-semibold text-base border border-white/10 transition-all duration-200"
              >
                <GithubIcon className="w-5 h-5" />
                <span>View on GitHub</span>
              </a>
            </div>

            {/* Feature Highlights Tickers */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/[0.08] w-full max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">365 Days</div>
                <div className="text-xs text-zinc-400 mt-0.5">Single-Page Matrix</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-[#FFA800] tracking-tight">0% Cloud Lag</div>
                <div className="text-xs text-zinc-400 mt-0.5">Local SQLite Database</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight">100% Free</div>
                <div className="text-xs text-zinc-400 mt-0.5">No Signups / No Ads</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Device Mockup */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient circle glow behind device */}
            <div className="absolute inset-0 bg-[#FF6D00]/20 rounded-full blur-[80px] scale-90 pointer-events-none" />

            {/* Floating feature pills around device */}
            <div className="absolute -left-6 top-16 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#18181B]/90 border border-white/10 backdrop-blur-md shadow-xl z-30 animate-bounce duration-1000">
              <Flame className="w-4 h-4 text-[#FFA800]" />
              <span className="text-xs font-bold text-zinc-200">14-Day Streak Active</span>
            </div>

            <div className="absolute -right-4 bottom-24 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#18181B]/90 border border-white/10 backdrop-blur-md shadow-xl z-30">
              <Smartphone className="w-4 h-4 text-[#FF6D00]" />
              <span className="text-xs font-bold text-zinc-200">Home Screen Widget</span>
            </div>

            {/* Main Phone Frame */}
            <div className="relative z-20 w-full flex justify-center">
              <DeviceFrame>
                <MockupYearGrid />
              </DeviceFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
