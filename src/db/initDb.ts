import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export const openDatabase = async () => {
    if (!db) {
        db = await SQLite.openDatabaseAsync('fleet.db');
    }
    return db;
};

export const initDatabase = async () => {
    const database = await openDatabase();
    await database.execAsync(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      plate TEXT NOT NULL,
      alias TEXT NOT NULL,
      isActive INTEGER DEFAULT 0,
      createdAtUtc TEXT NOT NULL
    );
  `);
    await database.execAsync(`
    CREATE TABLE IF NOT EXISTS telemetry_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicleId TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      speedKph INTEGER NOT NULL,
      capturedAtUtc TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      retryCount INTEGER DEFAULT 0,
      FOREIGN KEY (vehicleId) REFERENCES vehicles(id)
    );
  `);
    console.log('[DB] Tablas creadas/verificadas');
};