"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

export function MockupWidget() {
  const [tasks, setTasks] = useState([
    { id: "1", title: "Apply to 2 Google internships", completed: true },
    { id: "2", title: "Complete Heap DSA practice", completed: true },
    { id: "3", title: "Review system architecture", completed: false },
  ]);

  const toggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completed = tasks.filter((t) => t.completed).length;
  const pct = Math.round((completed / tasks.length) * 100);

  return (
    <div className="flex-1 flex flex-col p-3 text-white overflow-hidden relative bg-gradient-to-b from-[#1a120b] via-[#24130c] to-[#0d0d11]">
      {/* Simulated Home Screen Wallpaper aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,109,0,0.15),transparent_60%)] pointer-events-none" />

      {/* App Icons grid atop wallpaper */}
      <div className="grid grid-cols-4 gap-3 pt-2 mb-4 opacity-40">
        {["Brave", "Proton", "Files", "Chat"].map((app, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md" />
            <span className="text-[9px] text-zinc-400 font-medium">{app}</span>
          </div>
        ))}
      </div>

      {/* THE ACTUAL DAYFULE ANDROID WIDGET */}
      <div className="relative z-10 w-full rounded-2xl bg-[#121214] border border-[#26262B] p-3.5 shadow-2xl transition-all duration-300 hover:border-[#FF6D00]/50">
        {/* Widget Header */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-xs font-bold text-[#FF6D00] tracking-tight">
              DAYFULE
            </span>
            <span className="text-[11px] text-[#A1A1AA]">· Today</span>
          </div>

          {/* Progress pill */}
          <div className="px-2 py-0.5 rounded-md bg-[#1C1C20] border border-[#33333C] text-[10px] font-bold text-zinc-200">
            {pct}% ({completed}/{tasks.length})
          </div>
        </div>

        {/* Task rows */}
        <div className="space-y-1.5">
          {tasks.map((t) => (
            <div
              key={t.id}
              onClick={() => toggle(t.id)}
              className="flex items-center gap-2 cursor-pointer group py-0.5"
            >
              <span
                className={`text-xs font-bold ${
                  t.completed ? "text-[#2ECC71]" : "text-zinc-500"
                }`}
              >
                {t.completed ? "✓" : "○"}
              </span>
              <span
                className={`text-[11px] truncate flex-1 ${
                  t.completed ? "text-zinc-500 line-through" : "text-zinc-100"
                }`}
              >
                {t.title}
              </span>
            </div>
          ))}
        </div>

        {/* Clean, no "tap to open" or border line */}
      </div>

      {/* Widget callout badge */}
      <div className="mt-auto pb-1 text-center">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6D00] animate-pulse" />
          Live Android Home Screen Sync
        </span>
      </div>
    </div>
  );
}
