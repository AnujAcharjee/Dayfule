"use client";

import React, { useState } from "react";
import { Flame, LayoutGrid, Moon, CheckCircle2 } from "lucide-react";

export function MockupYearGrid() {
  const [compact, setCompact] = useState(false);
  const [activeDay, setActiveDay] = useState(17);

  // Generate 12 months with representative states
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <div className="flex-1 flex flex-col p-3 text-white overflow-hidden bg-[#0A0A0C]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg font-bold tracking-tight bg-gradient-to-r from-[#FFA800] via-[#FF6D00] to-[#FF3D00] bg-clip-text text-transparent">
            Dayfule
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCompact(!compact)}
            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-white/[0.06] border border-white/10 text-zinc-300 hover:text-white"
          >
            <LayoutGrid className="w-3 h-3 text-[#FF6D00]" />
            <span>{compact ? "Comfort" : "Compact"}</span>
          </button>
          <div className="p-1 rounded-md bg-white/[0.06] border border-white/10 text-zinc-400">
            <Moon className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Streak & Stat banner */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-[#FF6D00]/15 to-transparent border border-[#FF6D00]/25 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FF6D00]/20 flex items-center justify-center text-[#FF6D00]">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 font-medium">Streak</div>
            <div className="text-xs font-bold text-[#FFA800]">14 Days 🔥</div>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 font-medium">Completed</div>
            <div className="text-xs font-bold text-zinc-200">82% (298/365)</div>
          </div>
        </div>
      </div>

      {/* 365 Days Grid View */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          2026 Year Overview
        </div>

        <div className="grid grid-cols-4 gap-2">
          {months.slice(0, 8).map((month, mIdx) => (
            <div
              key={month}
              className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06]"
            >
              <div className="text-[9px] font-bold text-zinc-400 mb-1 flex items-center justify-between">
                <span>{month}</span>
                <span className="text-[8px] text-zinc-500">31d</span>
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: 28 }).map((_, dIdx) => {
                  const dayNum = dIdx + 1;
                  // Color codes
                  const isBreak = mIdx === 6 && (dayNum === 10 || dayNum === 11);
                  const isExam = mIdx === 4 && (dayNum >= 15 && dayNum <= 18);
                  const isDone = (dIdx * 7 + mIdx) % 5 !== 0;
                  const isToday = mIdx === 10 && dayNum === activeDay;

                  let bg = "bg-zinc-800/60";
                  if (isToday) bg = "bg-[#FF6D00] shadow-[0_0_8px_#FF6D00] ring-1 ring-white";
                  else if (isBreak) bg = "bg-[#FF8DA1]";
                  else if (isExam) bg = "bg-[#FFD600]";
                  else if (isDone) bg = "bg-emerald-500/80";

                  return (
                    <div
                      key={dIdx}
                      onClick={() => setActiveDay(dayNum)}
                      className={`w-full aspect-square rounded-[2px] ${bg} cursor-pointer transition-transform hover:scale-125`}
                      title={`${month} ${dayNum}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="pt-2 flex items-center justify-between text-[9px] text-zinc-400 border-t border-white/[0.06]">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-emerald-500" />
            <span>Done</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-[#FF8DA1]" />
            <span>Break</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-[#FFD600]" />
            <span>Exam</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-[#FF6D00]" />
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
