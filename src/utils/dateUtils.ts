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
  breakDays: Set<string> = new Set(),
  examDays: Set<string> = new Set()
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
    const isExamDay = examDays.has(dateStr);

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
      isExamDay,
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
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  let totalTasks = 0;
  let completedTasks = 0;
  let activeDays = 0;
  let perfectDays = 0;
  let daysPassed = 0;

  let longestStreak = 0;
  let tempStreak = 0;

  for (const day of days) {
    totalTasks += day.totalTasks;
    completedTasks += day.completedTasks;

    const hadTasks = day.totalTasks > 0;
    const isSpecialDay = day.isBreakDay || day.isExamDay;
    const isPerfect = (hadTasks && day.completedTasks === day.totalTasks) || isSpecialDay;

    if (hadTasks || isSpecialDay) {
      activeDays++;
    }

    if (day.isPast || day.isToday) {
      daysPassed++;
    }

    if (!day.isFuture) {
      if (isPerfect) {
        perfectDays++;
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else if (day.isPast) {
        tempStreak = 0;
      }
    }
  }

  // Calculate current streak:
  // 1. Check if today is completed
  const today = days.find((d) => d.isToday);
  const isTodayCompleted = today
    ? (today.totalTasks > 0 && today.completedTasks === today.totalTasks) ||
      today.isBreakDay ||
      today.isExamDay
    : false;

  // 2. Count consecutive completed days backwards starting from yesterday
  const pastDays = days.filter((d) => d.date_str < todayKey);
  let pastStreak = 0;

  // Only count past streak if pastDays connects to yesterday
  if (pastDays.length > 0 && pastDays[pastDays.length - 1].date_str === yesterdayKey) {
    for (let i = pastDays.length - 1; i >= 0; i--) {
      const d = pastDays[i];
      const isCompleted =
        (d.totalTasks > 0 && d.completedTasks === d.totalTasks) ||
        d.isBreakDay ||
        d.isExamDay;

      if (isCompleted) {
        pastStreak++;
      } else {
        break;
      }
    }
  }

  // 3. Current streak:
  // - If today is finished, it adds +1 to the past streak.
  // - If today is still in progress, the active streak through yesterday is maintained.
  const currentStreak = isTodayCompleted ? pastStreak + 1 : pastStreak;

  longestStreak = Math.max(longestStreak, currentStreak);

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

/**
 * Returns an array of YYYY-MM-DD date strings for all dates between
 * startDateStr and endDateStr (inclusive).
 */
export function getDateRangeArray(startDateStr: string, endDateStr: string): string[] {
  let start = parseDateKey(startDateStr);
  let end = parseDateKey(endDateStr);

  if (start > end) {
    const temp = start;
    start = end;
    end = temp;
  }

  const result: string[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    result.push(formatDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}

/**
 * Formats YYYY-MM-DD into short month + day (e.g., "Nov 19" or "Nov 19, 2026")
 */
export function formatDateShort(dateStr: string, includeYear: boolean = false): string {
  const date = parseDateKey(dateStr);
  const month = MONTH_NAMES_SHORT[date.getMonth()];
  const day = date.getDate();
  if (includeYear) {
    return `${month} ${day}, ${date.getFullYear()}`;
  }
  return `${month} ${day}`;
}

/**
 * Adds (or subtracts) a number of days to a YYYY-MM-DD date string
 */
export function addDaysToDateKey(dateStr: string, daysToAdd: number): string {
  const date = parseDateKey(dateStr);
  date.setDate(date.getDate() + daysToAdd);
  return formatDateKey(date);
}
