import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/env.js';
import { runMigrations } from './migrations.js';
import { seedOpportunities } from './seedOpportunities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the directory for SQLite exists
const dbFullPath = path.isAbsolute(config.databasePath)
  ? config.databasePath
  : path.resolve(__dirname, '../../', config.databasePath);

const dbDir = path.dirname(dbFullPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(dbFullPath);

// Enable busy timeout, WAL journal mode and Foreign Keys for ACID compliance and data integrity
try {
  db.exec('PRAGMA busy_timeout = 10000;');
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
} catch (e) {
  // If database is already open in WAL mode
}

export function initDatabase() {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT,
      bio TEXT,
      role TEXT NOT NULL DEFAULT 'reader',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS manga (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      japanese_title TEXT,
      slug TEXT UNIQUE NOT NULL,
      synopsis TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      banner_image TEXT,
      author TEXT NOT NULL,
      artist TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Ongoing',
      demographic TEXT NOT NULL DEFAULT 'Shonen',
      release_year INTEGER NOT NULL DEFAULT 2024,
      genres TEXT NOT NULL,
      rating_avg REAL DEFAULT 0.0,
      rating_count INTEGER DEFAULT 0,
      views_count INTEGER DEFAULT 0,
      bookmarks_count INTEGER DEFAULT 0,
      creator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      is_featured INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      manga_id INTEGER NOT NULL REFERENCES manga(id) ON DELETE CASCADE,
      chapter_number REAL NOT NULL,
      title TEXT NOT NULL,
      release_date TEXT DEFAULT CURRENT_TIMESTAMP,
      views_count INTEGER DEFAULT 0,
      pages TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      manga_id INTEGER NOT NULL REFERENCES manga(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'reading',
      last_read_chapter_id INTEGER REFERENCES chapters(id) ON DELETE SET NULL,
      last_read_page INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, manga_id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      manga_id INTEGER NOT NULL REFERENCES manga(id) ON DELETE CASCADE,
      rating_story INTEGER NOT NULL CHECK(rating_story BETWEEN 1 AND 5),
      rating_art INTEGER NOT NULL CHECK(rating_art BETWEEN 1 AND 5),
      rating_characters INTEGER NOT NULL CHECK(rating_characters BETWEEN 1 AND 5),
      rating_overall REAL NOT NULL CHECK(rating_overall BETWEEN 1 AND 5),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      likes_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, manga_id)
    );

    CREATE TABLE IF NOT EXISTS chapter_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reading_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
      manga_id INTEGER NOT NULL REFERENCES manga(id) ON DELETE CASCADE,
      progress_percent INTEGER DEFAULT 100,
      read_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, chapter_id)
    );

    -- Indices for high performance queries
    CREATE INDEX IF NOT EXISTS idx_manga_slug ON manga(slug);
    CREATE INDEX IF NOT EXISTS idx_manga_featured ON manga(is_featured);
    CREATE INDEX IF NOT EXISTS idx_chapters_manga_id ON chapters(manga_id, chapter_number);
    CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id, status);
    CREATE INDEX IF NOT EXISTS idx_reviews_manga ON reviews(manga_id);
    CREATE INDEX IF NOT EXISTS idx_chapter_comments ON chapter_comments(chapter_id);
    CREATE INDEX IF NOT EXISTS idx_history_user ON reading_history(user_id, read_at);
  `;

  db.exec(schema);
  console.log('[Database] Legacy schema verified and indexes initialized successfully.');

  // Run Kaamsetu Phase 2 migrations and seeding
  runMigrations(db);
  seedOpportunities(db);
}
