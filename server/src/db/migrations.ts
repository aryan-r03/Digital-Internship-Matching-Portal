import { DatabaseSync } from 'node:sqlite';

export function runMigrations(db: DatabaseSync): void {
  // Ensure Foreign Keys and WAL mode are active
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA journal_mode = WAL;');

  // Begin transaction for DDL migrations
  db.exec(`
    -- Candidate Profiles Table
    CREATE TABLE IF NOT EXISTS candidate_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      full_name TEXT NOT NULL,
      headline TEXT,
      bio TEXT,
      phone TEXT,
      current_location TEXT DEFAULT 'Bengaluru, India',
      preferred_locations TEXT DEFAULT '["Bengaluru", "Remote", "Gurugram", "Hyderabad"]',
      work_modes TEXT DEFAULT '["Remote", "Hybrid"]',
      experience_level TEXT DEFAULT 'Fresher / Student',
      current_institution TEXT,
      graduation_year INTEGER DEFAULT 2025,
      degree TEXT DEFAULT 'B.Tech / B.E.',
      field_of_study TEXT DEFAULT 'Computer Science & Engineering',
      cgpa REAL DEFAULT 8.5,
      skills TEXT DEFAULT '[]',
      portfolio_url TEXT,
      github_url TEXT,
      linkedin_url TEXT,
      resume_filename TEXT,
      resume_path TEXT,
      preferred_roles TEXT DEFAULT '["Full Stack Developer", "AI / ML Engineer", "Frontend Developer"]',
      min_stipend_expected INTEGER DEFAULT 25000,
      availability_months INTEGER DEFAULT 6,
      readiness_score INTEGER DEFAULT 40,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Internships Table (Explicitly marked is_mock_data = 1 for Demo Integrity)
    CREATE TABLE IF NOT EXISTS internships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      company_name TEXT NOT NULL,
      company_logo TEXT NOT NULL,
      company_website TEXT,
      is_verified INTEGER DEFAULT 1,
      category TEXT NOT NULL,
      role_type TEXT NOT NULL DEFAULT 'Internship',
      work_mode TEXT NOT NULL DEFAULT 'Remote',
      location TEXT NOT NULL,
      stipend_min INTEGER NOT NULL,
      stipend_max INTEGER NOT NULL,
      stipend_period TEXT DEFAULT 'month',
      ppo_offered INTEGER DEFAULT 0,
      ppo_ctc_min REAL,
      ppo_ctc_max REAL,
      duration_months INTEGER DEFAULT 6,
      experience_level TEXT DEFAULT 'Students & Freshers',
      description TEXT NOT NULL,
      responsibilities TEXT NOT NULL,
      requirements TEXT NOT NULL,
      preferred_qualifications TEXT,
      perks TEXT,
      eligible_batches TEXT NOT NULL,
      eligible_degrees TEXT NOT NULL,
      min_cgpa REAL DEFAULT 6.5,
      is_mock_data INTEGER NOT NULL DEFAULT 1,
      is_active INTEGER NOT NULL DEFAULT 1,
      deadline TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Saved Internships (Bookmarks)
    CREATE TABLE IF NOT EXISTS saved_internships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      internship_id INTEGER NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, internship_id)
    );

    -- Applications Tracker Table
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      internship_id INTEGER NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'applied' CHECK(status IN ('interested', 'applied', 'in_review', 'interview', 'rejected', 'offer')),
      cover_note TEXT,
      resume_used TEXT,
      match_score INTEGER DEFAULT 0,
      match_reasons TEXT,
      applied_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, internship_id)
    );

    -- Private Résumé Documents Metadata
    CREATE TABLE IF NOT EXISTS resumes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      original_filename TEXT NOT NULL,
      storage_filename TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      file_path TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Performance and Constraint Indexes
    CREATE INDEX IF NOT EXISTS idx_candidate_profiles_user ON candidate_profiles(user_id);
    CREATE INDEX IF NOT EXISTS idx_internships_category ON internships(category);
    CREATE INDEX IF NOT EXISTS idx_internships_work_mode ON internships(work_mode);
    CREATE INDEX IF NOT EXISTS idx_internships_active ON internships(is_active);
    CREATE INDEX IF NOT EXISTS idx_internships_slug ON internships(slug);
    CREATE INDEX IF NOT EXISTS idx_saved_internships_user ON saved_internships(user_id);
    CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
    CREATE INDEX IF NOT EXISTS idx_applications_internship ON applications(internship_id);
    CREATE INDEX IF NOT EXISTS idx_resumes_user ON resumes(user_id);
  `);

  console.log('[Database] Kaamsetu Phase 2 schema migrations executed successfully.');
}
