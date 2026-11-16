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

    CREATE TABLE IF NOT EXISTS exam_days (
      date_str TEXT PRIMARY KEY NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // Seamlessly import historical records from taskfule.db if transitioning from previous database
  try {
    await db.execAsync(`
      ATTACH DATABASE 'taskfule.db' AS legacy_db;
      INSERT OR IGNORE INTO tasks SELECT * FROM legacy_db.tasks;
      INSERT OR IGNORE INTO break_days SELECT * FROM legacy_db.break_days;
      INSERT OR IGNORE INTO year_archives SELECT * FROM legacy_db.year_archives;
      INSERT OR IGNORE INTO app_settings SELECT * FROM legacy_db.app_settings;
      DETACH DATABASE legacy_db;
    `);
  } catch {
    // If legacy_db does not exist or fails to attach, ignore safely
  }
}
