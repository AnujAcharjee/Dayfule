import { SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      date_str TEXT NOT NULL,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      priority TEXT NOT NULL DEFAULT 'normal',
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date_str);
    CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);

    CREATE TABLE IF NOT EXISTS year_archives (
      year INTEGER PRIMARY KEY NOT NULL,
      archived_at TEXT NOT NULL,
      note TEXT,
      total_tasks INTEGER DEFAULT 0,
      completed_tasks INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS break_days (
      date_str TEXT PRIMARY KEY NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}
