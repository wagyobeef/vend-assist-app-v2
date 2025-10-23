import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "vendassist.db";

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }

  db = await SQLite.openDatabaseAsync(DATABASE_NAME);

  // Create sessions table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create deals table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS deals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      vendor_name TEXT,
      collector_name TEXT,
      vendor_total REAL DEFAULT 0,
      collector_total REAL DEFAULT 0,
      deal_status TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
    );
  `);

  console.log("Database initialized successfully");
  return db;
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return db;
};

export const resetDatabase = async (): Promise<void> => {
  const database = getDatabase();

  await database.execAsync("DROP TABLE IF EXISTS deals;");
  await database.execAsync("DROP TABLE IF EXISTS sessions;");

  console.log(
    "Database reset complete - tables will be recreated on app restart"
  );
};
