"use client";

import React from "react";
import { Flame, ShieldCheck, Heart, Sparkles, Check } from "lucide-react";

export function MockupStreakPreservation() {
  return (
    <div className="flex-1 flex flex-col p-3 text-white overflow-hidden bg-[#0A0A0C] justify-between">
      {/* Top Banner */}
      <div className="text-center pt-2 pb-1">
        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF6D00]/20 text-[#FFA800] border border-[#FF6D00]/30">
          <ShieldCheck className="w-3 h-3" />
          Smart Streak Protection
        </span>
        <h4 className="text-sm font-bold text-white mt-1">Guilt-Free Rest & Study</h4>
      </div>

      {/* Interactive visual comparison card */}
      <div className="space-y-2.5 my-auto">
        {/* Break Mode Card */}
        <div className="p-3 rounded-2xl bg-[#FF8DA1]/10 border border-[#FF8DA1]/30 shadow-[0_0_20px_rgba(255,141,161,0.15)] flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF8DA1]/20 border border-[#FF8DA1]/40 flex items-center justify-center text-[#FF8DA1] shrink-0">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#FF8DA1]">Break Day Mode</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#FF8DA1]/20 text-[#FF8DA1] font-semibold">
                ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-zinc-300 mt-0.5 leading-relaxed">
              Full pink ring. Rest, recharge, or travel without losing your 14-day streak.
            </p>
          </div>
        </div>

        {/* Exam Mode Card */}
        <div className="p-3 rounded-2xl bg-[#FFD600]/10 border border-[#FFD600]/30 shadow-[0_0_20px_rgba(255,214,0,0.15)] flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFD600]/20 border border-[#FFD600]/40 flex items-center justify-center text-[#FFD600] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#FFD600]">Exams Mode</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#FFD600]/20 text-[#FFD600] font-semibold">
                PROTECTED
              </span>
            </div>
            <p className="text-[10px] text-zinc-300 mt-0.5 leading-relaxed">
              Full yellow ring. Focus on midterms & finals while keeping habit data intact.
            </p>
          </div>
        </div>

        {/* Streak Result badge */}
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#FF6D00]/20 via-[#FF8A00]/20 to-[#FF3D00]/20 border border-[#FF6D00]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FF6D00] flex items-center justify-center text-white">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400">Total Consistency</div>
              <div className="text-xs font-extrabold text-[#FFA800]">15 Days Active 🔥</div>
            </div>
          </div>
          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
            Streak Saved
          </span>
        </div>
      </div>

      {/* Bottom tag */}
      <div className="text-center text-[9px] text-zinc-500 pb-1">
        Habits are built through consistency, not burnout.
      </div>
    </div>
  );
}
