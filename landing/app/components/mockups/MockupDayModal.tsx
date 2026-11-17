"use client";

import React, { useState } from "react";
import { Coffee, GraduationCap, Plus, Check, Trash2, Edit2 } from "lucide-react";

export function MockupDayModal() {
  const [tasks, setTasks] = useState([
    { id: "1", title: "Apply to 2 Google internships", priority: "high", completed: true },
    { id: "2", title: "Complete Heap DSA practice", priority: "normal", completed: true },
    { id: "3", title: "Review system architecture", priority: "normal", completed: false },
  ]);

  const [isBreak, setIsBreak] = useState(false);
  const [isExam, setIsExam] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const percentage = Math.round((completedCount / tasks.length) * 100);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="flex-1 flex flex-col p-3 text-white overflow-hidden bg-[#0A0A0C]">
      {/* Blurred background preview */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* Modal Card */}
      <div className="relative z-10 flex-1 flex flex-col rounded-2xl bg-[#121215] border border-white/10 p-3 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
          <div>
            <h3 className="text-xs font-bold text-white tracking-tight">
              Tuesday, Nov 17, 2026
            </h3>
            <p className="text-[10px] text-zinc-400">Day 321 of 365</p>
          </div>
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-zinc-400 text-xs">
            ✕
          </div>
        </div>

        {/* Action Row - single line layout */}
        <div className="flex items-center gap-1.5 mb-3">
          {/* DayLoader Circular Indicator */}
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-zinc-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 transition-all duration-300"
                strokeDasharray={`${percentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[8px] font-bold text-white">
              {percentage}%
            </span>
          </div>

          {/* Break Button */}
          <button
            onClick={() => {
              setIsBreak(!isBreak);
              if (!isBreak) setIsExam(false);
            }}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-[10px] font-semibold transition-all ${
              isBreak
                ? "bg-[#FF8DA1] text-black border-[#FF8DA1] shadow-[0_0_10px_rgba(255,141,161,0.5)]"
                : "bg-white/[0.04] text-[#FF8DA1] border-[#FF8DA1]/30 hover:border-[#FF8DA1]"
            }`}
          >
            <Coffee className="w-3 h-3" />
            <span>Break</span>
          </button>

          {/* Exams Button */}
          <button
            onClick={() => {
              setIsExam(!isExam);
              if (!isExam) setIsBreak(false);
            }}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-[10px] font-semibold transition-all ${
              isExam
                ? "bg-[#FFD600] text-black border-[#FFD600] shadow-[0_0_10px_rgba(255,214,0,0.5)]"
                : "bg-white/[0.04] text-[#FFD600] border-[#FFD600]/30 hover:border-[#FFD600]"
            }`}
          >
            <GraduationCap className="w-3 h-3" />
            <span>Exams</span>
          </button>

          {/* Add Task Button */}
          <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-[#0A84FF] hover:bg-[#0070E0] text-white text-[10px] font-bold shadow-[0_0_10px_rgba(10,132,255,0.4)]">
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </div>

        {/* Tasks Header */}
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center justify-between">
          <span>Tasks ({completedCount}/{tasks.length})</span>
          <span className="text-[9px] text-[#FF6D00] font-medium">Click to toggle</span>
        </div>

        {/* Task List */}
        <div className="flex-1 space-y-2 overflow-y-auto">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                task.completed
                  ? "bg-white/[0.02] border-white/[0.06] opacity-75"
                  : "bg-white/[0.05] border-white/10 hover:border-white/20"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                  task.completed
                    ? "bg-emerald-500 border-emerald-500 text-black"
                    : "border-zinc-500 bg-transparent"
                }`}
              >
                {task.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>

              {/* Title & Priority */}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-[11px] font-medium leading-tight truncate ${
                    task.completed ? "line-through text-zinc-500" : "text-white"
                  }`}
                >
                  {task.title}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                      task.priority === "high"
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    }`}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 text-zinc-500">
                <Edit2 className="w-3 h-3 hover:text-zinc-300" />
                <Trash2 className="w-3 h-3 hover:text-red-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
