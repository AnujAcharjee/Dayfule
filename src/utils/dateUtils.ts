import { DayProgress, YearStats } from '@/types';

/**
 * Returns YYYY-MM-DD in local time
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses YYYY-MM-DD into a local Date object
 */
export function parseDateKey(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Returns today's date string YYYY-MM-DD
 */
export function getTodayKey(): string {
  return formatDateKey(new Date());
}

/**
 * Checks if a given year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns the total number of days in a given year
 */
export function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const WEEKDAY_NAMES_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/**
 * Generates all DayProgress objects for a full year (365 or 366 days)
 * with their initial counts.
 */
export function generateYearDays(
  year: number,
  taskAggregations: Record<string, { total: number; completed: number }> = {},
  breakDays: Set<string> = new Set()
): DayProgress[] {
  const days: DayProgress[] = [];
  const todayKey = getTodayKey();
  const totalDays = getDaysInYear(year);

  // Start at Jan 1
  const cursor = new Date(year, 0, 1);

  for (let i = 0; i < totalDays; i++) {
    const dateStr = formatDateKey(cursor);
    const agg = taskAggregations[dateStr] || { total: 0, completed: 0 };
    const totalTasks = agg.total;
    const completedTasks = agg.completed;
    const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

    const isToday = dateStr === todayKey;
    const isPast = dateStr < todayKey;
    const isFuture = dateStr > todayKey;
    const isFrozen = isPast; // Day freezes automatically at the end of the day
    const isBreakDay = breakDays.has(dateStr);

    days.push({
      date_str: dateStr,
      dayOfMonth: cursor.getDate(),
      monthIndex: cursor.getMonth(),
      year,
      dayOfWeek: cursor.getDay(),
      totalTasks,
      completedTasks,
      progress,
      isToday,
      isPast,
      isFuture,
      isFrozen,
      isBreakDay,
    });

    // Advance to next day
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

/**
 * Groups full year days into 12 months for month view
 */
export function groupDaysByMonth(days: DayProgress[]): DayProgress[][] {
  const months: DayProgress[][] = Array.from({ length: 12 }, () => []);
  for (const day of days) {
    months[day.monthIndex].push(day);
  }
  return months;
}

/**
 * Formats date key into human-readable date, e.g. "Monday, Nov 17, 2026"
 */
export function formatFullDate(dateStr: string): string {
  const date = parseDateKey(dateStr);
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const month = MONTH_NAMES[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${weekday}, ${month} ${day}, ${year}`;
}

/**
 * Computes streaks and overall stats for the year
 */
export function calculateYearStats(year: number, days: DayProgress[]): YearStats {
  const todayKey = getTodayKey();
  let totalTasks = 0;
  let completedTasks = 0;
  let activeDays = 0;
  let perfectDays = 0;
  let daysPassed = 0;

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (const day of days) {
    totalTasks += day.totalTasks;
    completedTasks += day.completedTasks;

    const hadTasks = day.totalTasks > 0;
    const isPerfect = (hadTasks && day.completedTasks === day.totalTasks) || day.isBreakDay;

    if (hadTasks || day.isBreakDay) {
      activeDays++;
    }

    if (isPerfect) {
      perfectDays++;
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      if (day.isPast && hadTasks && !isPerfect) {
        tempStreak = 0;
      }
    }

    if (day.isPast || day.isToday) {
      daysPassed++;
    }
  }

  // Calculate current streak backwards from today or yesterday
  let streakCheck = 0;
  // find index of today or last past day
  const relevantDays = days.filter((d) => d.date_str <= todayKey);
  for (let i = relevantDays.length - 1; i >= 0; i--) {
    const d = relevantDays[i];
    // if today has 0 tasks yet, skip today and look at yesterday
    if (d.isToday && d.totalTasks === 0) {
      continue;
    }
    if (d.totalTasks > 0 && d.completedTasks === d.totalTasks) {
      streakCheck++;
    } else {
      break;
    }
  }
  currentStreak = streakCheck;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    year,
    totalDays: days.length,
    daysPassed,
    activeDays,
    perfectDays,
    totalTasks,
    completedTasks,
    completionRate,
    currentStreak,
    longestStreak,
  };
}
