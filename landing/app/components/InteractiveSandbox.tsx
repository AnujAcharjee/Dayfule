"use client";

import React, { useState } from "react";
import { Coffee, GraduationCap, Plus, Check, Trash2, Sparkles, Flame, Play } from "lucide-react";

export function InteractiveSandbox() {
  const [tasks, setTasks] = useState([
    { id: "1", title: "Apply to 2 Google internships", priority: "high", completed: true },
    { id: "2", title: "Complete Heap DSA practice", priority: "normal", completed: true },
    { id: "3", title: "Review system architecture", priority: "normal", completed: false },
    { id: "4", title: "Evening 30-min run", priority: "low", completed: false },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isBreak, setIsBreak] = useState(false);
  const [isExam, setIsExam] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const percentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        priority: "normal",
        completed: false,
      },
    ]);
    setNewTaskTitle("");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <section id="interactive-demo" className="relative py-20 lg:py-28 border-t border-white/[0.06] bg-[#07070A]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6D00]/10 border border-[#FF6D00]/30 text-xs font-semibold text-[#FFA800] uppercase tracking-wider mb-3">
            <Play className="w-3.5 h-3.5 fill-current" />
            Live Web Playground
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Try Dayfule Right in Your Browser
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Click tasks to complete them, toggle Break or Exam modes, and watch the circular DayLoader react in real time.
          </p>
        </div>

        {/* Sandbox Container */}
        <div className="relative max-w-xl mx-auto rounded-3xl bg-[#111114] border border-white/10 p-5 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,109,0,0.15)]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Today&apos;s Focus</span>
                {percentage === 100 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    All Done!
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Tuesday, November 17, 2026</p>
            </div>

            {/* Streak Counter badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF6D00]/15 border border-[#FF6D00]/30 text-xs font-bold text-[#FFA800]">
              <Flame className="w-4 h-4 text-[#FF6D00]" />
              <span>15-Day Streak</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 mb-5">
            {/* Circular Progress Gauge */}
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-zinc-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-500"
                  strokeDasharray={`${percentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[10px] font-extrabold text-white">
                {percentage}%
              </span>
            </div>

            {/* Break Toggle */}
            <button
              onClick={() => {
                setIsBreak(!isBreak);
                if (!isBreak) setIsExam(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isBreak
                  ? "bg-[#FF8DA1] text-black shadow-[0_0_15px_rgba(255,141,161,0.5)] scale-105"
                  : "bg-white/[0.04] text-[#FF8DA1] border border-[#FF8DA1]/30 hover:border-[#FF8DA1]"
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>{isBreak ? "Break Active" : "Take Break"}</span>
            </button>

            {/* Exams Toggle */}
            <button
              onClick={() => {
                setIsExam(!isExam);
                if (!isExam) setIsBreak(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isExam
                  ? "bg-[#FFD600] text-black shadow-[0_0_15px_rgba(255,214,0,0.5)] scale-105"
                  : "bg-white/[0.04] text-[#FFD600] border border-[#FFD600]/30 hover:border-[#FFD600]"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{isExam ? "Exams Mode" : "Exams"}</span>
            </button>

            <div className="ml-auto text-xs font-semibold text-zinc-400">
              {completedCount} of {tasks.length} Done
            </div>
          </div>

          {/* Quick Task Input Form */}
          <form onSubmit={addTask} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6D00] transition-colors"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0A84FF] hover:bg-[#0070E0] text-white text-xs font-bold transition-all shadow-[0_0_10px_rgba(10,132,255,0.3)] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          {/* Task List */}
          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  task.completed
                    ? "bg-white/[0.02] border-white/[0.06] opacity-75"
                    : "bg-white/[0.05] border-white/10 hover:border-white/20 hover:scale-[1.01]"
                }`}
              >
                {/* Custom Checkbox */}
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    task.completed
                      ? "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_10px_rgba(46,204,113,0.4)]"
                      : "border-zinc-500 bg-transparent hover:border-white"
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium leading-snug truncate ${
                      task.completed ? "line-through text-zinc-500" : "text-white"
                    }`}
                  >
                    {task.title}
                  </div>
                </div>

                {/* Priority Badge */}
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                    task.priority === "high"
                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      : task.priority === "low"
                      ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                      : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  }`}
                >
                  {task.priority.toUpperCase()}
                </span>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                  className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
