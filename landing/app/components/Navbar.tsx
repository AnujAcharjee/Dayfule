"use client";

import React from "react";
import Image from "next/image";
import { Download, Sparkles } from "lucide-react";
import { GithubIcon } from "./GithubIcon";

export function Navbar() {
  const apkDownloadUrl =
    "https://expo.dev/accounts/anujacharjee/projects/dayfule/builds/40f8bf57-db3a-47ef-8b7b-d01a68a3abe1";
  const githubUrl = "https://github.com/AnujAcharjee/Dayfule";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#050507]/80 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#FF6D00]/30 shadow-[0_0_15px_rgba(255,109,0,0.25)] group-hover:border-[#FF6D00]/60 transition-all">
            <Image
              src="/icon.png"
              alt="Dayfule Logo"
              width={36}
              height={36}
              className="object-cover"
            />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight bg-gradient-to-r from-[#FFA800] via-[#FF6D00] to-[#FF3D00] bg-clip-text text-transparent">
            Dayfule
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-400 border border-white/[0.08]">
            <Sparkles className="w-2.5 h-2.5 text-[#FF6D00]" />
            v1.0.0
          </span>
        </a>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a
            href="#features"
            className="hover:text-white transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#interactive-demo"
            className="hover:text-white transition-colors duration-200"
          >
            Interactive Demo
          </a>
          <a
            href="#architecture"
            className="hover:text-white transition-colors duration-200"
          >
            Offline & Privacy
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="GitHub Repository"
          >
            <GithubIcon className="w-5 h-5" />
          </a>

          <a
            href={apkDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6D00] to-[#E65100] hover:from-[#FF7A00] hover:to-[#F55100] text-white text-xs sm:text-sm font-semibold shadow-[0_0_20px_rgba(255,109,0,0.35)] hover:shadow-[0_0_25px_rgba(255,109,0,0.5)] transition-all duration-200 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download APK</span>
          </a>
        </div>
      </div>
    </header>
  );
}
