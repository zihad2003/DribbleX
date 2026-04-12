-- Migration: Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  date TEXT NOT NULL, -- ISO Format: YYYY-MM-DD
  startTime TEXT NOT NULL, -- e.g., "07:00 - 08:30"
  duration REAL NOT NULL DEFAULT 1.5,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, cancelled
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
