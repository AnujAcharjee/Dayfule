import { SQLiteDatabase } from 'expo-sqlite';
import { Task, YearArchive, TaskPriority } from '@/types';

export interface TaskAggregationRow {
  date_str: string;
  total: number;
  completed: number;
}

export class TasksRepository {
  constructor(private db: SQLiteDatabase) {}

  /**
   * Fetches aggregated task count and completed count for every day of the given year.
   * Runs in a single rapid query: e.g. "2026-%"
   */
  async getYearAggregations(year: number): Promise<Record<string, { total: number; completed: number }>> {
    const yearPattern = `${year}-%`;
    const rows = await this.db.getAllAsync<TaskAggregationRow>(
      `SELECT date_str, COUNT(*) as total, SUM(completed) as completed 
       FROM tasks 
       WHERE date_str LIKE ? 
       GROUP BY date_str`,
      [yearPattern]
    );

    const result: Record<string, { total: number; completed: number }> = {};
    for (const row of rows) {
      result[row.date_str] = {
        total: Number(row.total || 0),
        completed: Number(row.completed || 0),
      };
    }
    return result;
  }

  /**
   * Fetches all tasks for a specific date (YYYY-MM-DD).
   */
  async getTasksByDate(dateStr: string): Promise<Task[]> {
    const rows = await this.db.getAllAsync<Task>(
      `SELECT * FROM tasks WHERE date_str = ? ORDER BY completed ASC, created_at ASC`,
      [dateStr]
    );
    return rows;
  }

  /**
   * Inserts a new task
   */
  async createTask(params: {
    date_str: string;
    title: string;
    priority?: TaskPriority;
    notes?: string | null;
  }): Promise<Task> {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();
    const priority = params.priority || 'normal';
    const notes = params.notes || null;

    await this.db.runAsync(
      `INSERT INTO tasks (id, date_str, title, completed, completed_at, priority, notes, created_at, updated_at)
       VALUES (?, ?, ?, 0, NULL, ?, ?, ?, ?)`,
      [id, params.date_str, params.title.trim(), priority, notes, now, now]
    );

    return {
      id,
      date_str: params.date_str,
      title: params.title.trim(),
      completed: 0,
      completed_at: null,
      priority,
      notes,
      created_at: now,
      updated_at: now,
    };
  }

  /**
   * Updates a task's title, notes, or priority
   */
  async updateTask(
    id: string,
    updates: { title?: string; notes?: string | null; priority?: TaskPriority }
  ): Promise<void> {
    const now = new Date().toISOString();
    const current = await this.db.getFirstAsync<Task>(`SELECT * FROM tasks WHERE id = ?`, [id]);
    if (!current) return;

    const newTitle = updates.title !== undefined ? updates.title.trim() : current.title;
    const newNotes = updates.notes !== undefined ? (updates.notes || null) : (current.notes || null);
    const newPriority = updates.priority !== undefined ? updates.priority : current.priority;

    await this.db.runAsync(
      `UPDATE tasks SET title = ?, notes = ?, priority = ?, updated_at = ? WHERE id = ?`,
      [newTitle, newNotes, newPriority, now, id]
    );
  }

  /**
   * Toggles task completion state.
   * Returns the new completed value (0 or 1).
   */
  async toggleTask(id: string): Promise<number> {
    const task = await this.db.getFirstAsync<Task>(`SELECT completed FROM tasks WHERE id = ?`, [id]);
    if (!task) return 0;

    const newCompleted = task.completed === 1 ? 0 : 1;
    const now = new Date().toISOString();
    const completedAt = newCompleted === 1 ? now : null;

    await this.db.runAsync(
      `UPDATE tasks SET completed = ?, completed_at = ?, updated_at = ? WHERE id = ?`,
      [newCompleted, completedAt, now, id]
    );

    return newCompleted;
  }

  /**
   * Deletes a task by ID
   */
  async deleteTask(id: string): Promise<void> {
    await this.db.runAsync(`DELETE FROM tasks WHERE id = ?`, [id]);
  }

  /**
   * Checks if a year is archived
   */
  async isYearArchived(year: number): Promise<boolean> {
    const row = await this.db.getFirstAsync<{ year: number }>(
      `SELECT year FROM year_archives WHERE year = ?`,
      [year]
    );
    return !!row;
  }

  /**
   * Archives a year
   */
  async archiveYear(year: number, note?: string): Promise<void> {
    const yearPattern = `${year}-%`;
    const counts = await this.db.getFirstAsync<{ total: number; completed: number }>(
      `SELECT COUNT(*) as total, SUM(completed) as completed FROM tasks WHERE date_str LIKE ?`,
      [yearPattern]
    );

    const now = new Date().toISOString();
    await this.db.runAsync(
      `INSERT OR REPLACE INTO year_archives (year, archived_at, note, total_tasks, completed_tasks)
       VALUES (?, ?, ?, ?, ?)`,
      [year, now, note || null, Number(counts?.total || 0), Number(counts?.completed || 0)]
    );
  }

  /**
   * Unarchives a year
   */
  async unarchiveYear(year: number): Promise<void> {
    await this.db.runAsync(`DELETE FROM year_archives WHERE year = ?`, [year]);
  }

  /**
   * Gets all archived years
   */
  async getArchivedYears(): Promise<YearArchive[]> {
    return await this.db.getAllAsync<YearArchive>(
      `SELECT * FROM year_archives ORDER BY year DESC`
    );
  }

  /**
   * Gets distinct years that have tasks recorded
   */
  async getYearsWithData(): Promise<number[]> {
    const rows = await this.db.getAllAsync<{ year_part: string }>(
      `SELECT DISTINCT substr(date_str, 1, 4) as year_part FROM tasks ORDER BY year_part ASC`
    );
    const years = rows.map((r) => Number(r.year_part)).filter((y) => !isNaN(y));
    const currentYear = new Date().getFullYear();
    if (!years.includes(currentYear)) {
      years.push(currentYear);
    }
    return years.sort((a, b) => a - b);
  }

  /**
   * Fetches all break day date strings for a given year
   */
  async getYearBreakDays(year: number): Promise<Set<string>> {
    const yearPattern = `${year}-%`;
    const rows = await this.db.getAllAsync<{ date_str: string }>(
      `SELECT date_str FROM break_days WHERE date_str LIKE ?`,
      [yearPattern]
    );
    return new Set(rows.map((r) => r.date_str));
  }

  /**
   * Checks if a date is marked as a break day
   */
  async isBreakDay(dateStr: string): Promise<boolean> {
    const row = await this.db.getFirstAsync<{ date_str: string }>(
      `SELECT date_str FROM break_days WHERE date_str = ?`,
      [dateStr]
    );
    return !!row;
  }

  /**
   * Toggles break day status for a date.
   * Returns true if now a break day, false if unmarked.
   */
  async toggleBreakDay(dateStr: string): Promise<boolean> {
    const exists = await this.isBreakDay(dateStr);
    if (exists) {
      await this.db.runAsync(`DELETE FROM break_days WHERE date_str = ?`, [dateStr]);
      return false;
    } else {
      const now = new Date().toISOString();
      await this.db.runAsync(
        `INSERT INTO break_days (date_str, created_at) VALUES (?, ?)`,
        [dateStr, now]
      );
      return true;
    }
  }
}
