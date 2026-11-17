"use client";

import React from "react";

interface DeviceFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function DeviceFrame({ children, className = "" }: DeviceFrameProps) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[320px] sm:max-w-[340px] aspect-[9/19] rounded-[44px] p-3 bg-[#18181B] border-[3px] border-[#2E2E33] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(255,109,0,0.15)] ring-1 ring-white/10 ${className}`}
    >
      {/* Outer antenna bands */}
      <div className="absolute -left-1 top-24 w-1 h-8 bg-[#3f3f46] rounded-l" />
      <div className="absolute -left-1 top-36 w-1 h-12 bg-[#3f3f46] rounded-l" />
      <div className="absolute -right-1 top-28 w-1 h-14 bg-[#3f3f46] rounded-r" />

      {/* Screen Container */}
      <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-[#0A0A0C] flex flex-col border border-white/[0.05]">
        {/* Status Bar */}
        <div className="w-full h-8 px-6 pt-2 flex items-center justify-between text-[11px] text-zinc-400 font-semibold tracking-tight z-20">
          <span>9:41</span>
          {/* Camera punch hole / dynamic island */}
          <div className="w-16 h-3 bg-black rounded-full border border-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <div className="w-4 h-2 border border-zinc-400 rounded-sm p-[1px] flex items-center">
              <div className="w-2.5 h-full bg-zinc-300 rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative select-none">
          {children}
        </div>

        {/* Home Indicator */}
        <div className="w-full h-5 flex items-center justify-center pointer-events-none z-20">
          <div className="w-32 h-1 bg-zinc-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}
