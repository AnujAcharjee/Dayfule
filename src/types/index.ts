export type TaskPriority = 'high' | 'normal' | 'low';

export interface Task {
  id: string;
  date_str: string; // YYYY-MM-DD
  title: string;
  completed: number; // 0 or 1
  completed_at?: string | null;
  priority: TaskPriority;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DayProgress {
  date_str: string; // YYYY-MM-DD
  dayOfMonth: number;
  monthIndex: number; // 0 to 11
  year: number;
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  totalTasks: number;
  completedTasks: number;
  progress: number; // 0.0 to 1.0
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isFrozen: boolean;
  isBreakDay: boolean;
  isExamDay: boolean;
}

export interface YearStats {
  year: number;
  totalDays: number;
  daysPassed: number;
  activeDays: number;
  perfectDays: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number; // 0 - 100
  currentStreak: number;
  longestStreak: number;
}

export interface YearArchive {
  year: number;
  archived_at: string;
  note?: string | null;
  total_tasks?: number;
  completed_tasks?: number;
}

export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceHover: string;
  surfaceBorder: string;
  card: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  frozenText: string;
  frozenBg: string;
  frozenBorder: string;
  rainbow: readonly [string, string, ...string[]];
}
