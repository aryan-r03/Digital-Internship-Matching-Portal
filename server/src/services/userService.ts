import { db } from '../db/index.js';
import { hashPassword, comparePassword, generateToken } from '../middleware/auth.js';
import { User, AuthTokenPayload } from '../types/index.js';

export class UserService {
  static register(data: { username: string; email: string; password: string; role?: 'candidate' | 'employer' | 'reader' | 'creator' | 'admin' }) {
    const existingUser = db
      .prepare('SELECT id FROM users WHERE email = ? OR username = ?')
      .get(data.email.toLowerCase(), data.username.toLowerCase()) as { id: number } | undefined;

    if (existingUser) {
      throw { status: 409, message: 'A user with this email or username already exists.' };
    }

    const password_hash = hashPassword(data.password);
    const role = data.role || 'candidate';
    const avatar_url = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(data.username)}`;

    const result = db.prepare(`
      INSERT INTO users (username, email, password_hash, role, avatar_url)
      VALUES (?, ?, ?, ?, ?)
    `).run(data.username, data.email.toLowerCase(), password_hash, role, avatar_url);

    const userId = Number(result.lastInsertRowid);

    // If candidate, initialize default candidate profile
    if (role === 'candidate') {
      try {
        db.prepare(`
          INSERT OR IGNORE INTO candidate_profiles (
            user_id, full_name, headline, current_location, graduation_year, degree, field_of_study, cgpa, readiness_score
          ) VALUES (?, ?, 'Aspiring Software & AI Engineer', 'Bengaluru, India', 2025, 'B.Tech / B.E.', 'Computer Science & Engineering', 8.5, 45)
        `).run(userId, data.username);
      } catch (e) {
        console.warn('Profile initialization skipped:', e);
      }
    }

    const payload: AuthTokenPayload = {
      userId,
      username: data.username,
      email: data.email.toLowerCase(),
      role,
    };

    const token = generateToken(payload);
    return {
      user: {
        id: userId,
        username: data.username,
        email: data.email.toLowerCase(),
        role,
        avatar_url,
        bio: '',
        created_at: new Date().toISOString(),
      },
      token,
    };
  }

  static login(data: { emailOrUsername: string; password: string }) {
    const user = db.prepare(`
      SELECT * FROM users
      WHERE LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?)
    `).get(data.emailOrUsername, data.emailOrUsername) as any;

    if (!user) {
      throw { status: 401, message: 'Invalid credentials. Please check your username and password.' };
    }

    const isMatch = comparePassword(data.password, user.password_hash);
    if (!isMatch) {
      throw { status: 401, message: 'Invalid credentials. Please check your username and password.' };
    }

    const payload: AuthTokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);
    const { password_hash, ...safeUser } = user;

    return {
      user: safeUser,
      token,
    };
  }

  static getProfile(userId: number) {
    const user = db.prepare(`
      SELECT id, username, email, avatar_url, bio, role, created_at, updated_at
      FROM users WHERE id = ?
    `).get(userId) as any;

    if (!user) {
      throw { status: 404, message: 'User not found.' };
    }

    // Compute user stats
    const bookmarksCount = (db.prepare('SELECT COUNT(*) as count FROM bookmarks WHERE user_id = ?').get(userId) as any)?.count || 0;
    const chaptersReadCount = (db.prepare('SELECT COUNT(*) as count FROM reading_history WHERE user_id = ?').get(userId) as any)?.count || 0;
    const reviewsCount = (db.prepare('SELECT COUNT(*) as count FROM reviews WHERE user_id = ?').get(userId) as any)?.count || 0;

    return {
      ...user,
      stats: {
        bookmarksCount,
        chaptersReadCount,
        reviewsCount,
      },
    };
  }

  static updateProfile(userId: number, data: { bio?: string; avatar_url?: string }) {
    const updates: string[] = [];
    const params: any[] = [];

    if (data.bio !== undefined) {
      updates.push('bio = ?');
      params.push(data.bio);
    }
    if (data.avatar_url !== undefined) {
      updates.push('avatar_url = ?');
      params.push(data.avatar_url);
    }

    if (updates.length > 0) {
      updates.push("updated_at = datetime('now')");
      params.push(userId);
      db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    return this.getProfile(userId);
  }
}
