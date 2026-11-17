"use client";

import React from "react";
import Image from "next/image";
import { Mail, Heart, Sparkles } from "lucide-react";
import { GithubIcon } from "./GithubIcon";

export function Footer() {
  const githubUrl = "https://github.com/AnujAcharjee/Dayfule";

  return (
    <footer className="border-t border-white/[0.08] bg-[#050507] py-12 text-sm text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-[#FF6D00]/40">
              <Image
                src="/icon.png"
                alt="Dayfule"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <div>
              <span className="font-serif text-lg font-bold bg-gradient-to-r from-[#FFA800] via-[#FF6D00] to-[#FF3D00] bg-clip-text text-transparent">
                Dayfule
              </span>
              <p className="text-xs text-zinc-500">
                Single-Page Year Productivity Tracker
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <a
              href="#features"
              className="hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#interactive-demo"
              className="hover:text-white transition-colors"
            >
              Interactive Demo
            </a>
            <a
              href="#download"
              className="hover:text-white transition-colors"
            >
              Download
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="mailto:anujacharjee37@gmail.com"
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
              title="Contact Author"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            Designed & Built by{" "}
            <a
              href="mailto:anujacharjee37@gmail.com"
              className="text-zinc-300 font-semibold hover:text-[#FFA800] transition-colors"
            >
              Anuj Acharjee
            </a>
            . Licensed under{" "}
            <a
              href="https://github.com/AnujAcharjee/Dayfule/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-zinc-300"
            >
              MIT License
            </a>
            .
          </p>

          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-[#FF6D00] fill-current" />
            <span>for personal momentum</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
