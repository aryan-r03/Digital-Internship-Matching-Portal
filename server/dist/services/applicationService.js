import { db } from '../db/index.js';
import { InternshipService } from './internshipService.js';
import { ProfileService } from './profileService.js';
import { MatchingService } from './matchingService.js';
export class ApplicationService {
    /**
     * Bookmark / save an internship for the authenticated candidate.
     */
    static saveInternship(userId, internshipId) {
        const internship = InternshipService.getById(internshipId);
        if (!internship) {
            throw { status: 404, message: 'Internship not found.' };
        }
        db.prepare(`
      INSERT OR IGNORE INTO saved_internships (user_id, internship_id)
      VALUES (?, ?)
    `).run(userId, internshipId);
    }
    /**
     * Remove a bookmark / unsave an internship.
     */
    static unsaveInternship(userId, internshipId) {
        db.prepare(`
      DELETE FROM saved_internships WHERE user_id = ? AND internship_id = ?
    `).run(userId, internshipId);
    }
    /**
     * List all saved internships for a candidate.
     */
    static listSaved(userId) {
        const rows = db.prepare(`
      SELECT s.*, i.title, i.slug, i.company_name, i.company_logo, i.category,
             i.work_mode, i.location, i.stipend_min, i.stipend_max, i.stipend_period,
             i.ppo_offered, i.ppo_ctc_min, i.ppo_ctc_max, i.deadline, i.is_mock_data
      FROM saved_internships s
      JOIN internships i ON s.internship_id = i.id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
    `).all(userId);
        return rows.map((r) => ({
            id: r.id,
            user_id: r.user_id,
            internship_id: r.internship_id,
            created_at: r.created_at,
            internship: InternshipService.getById(r.internship_id) || undefined,
        }));
    }
    /**
     * Check if an internship is saved by the candidate.
     */
    static isSaved(userId, internshipId) {
        const row = db.prepare(`
      SELECT id FROM saved_internships WHERE user_id = ? AND internship_id = ?
    `).get(userId, internshipId);
        return Boolean(row);
    }
    /**
     * Submit an application to an internship with real-time explainable match snapshot.
     */
    static apply(userId, internshipId, coverNote) {
        const internship = InternshipService.getById(internshipId);
        if (!internship) {
            throw { status: 404, message: 'Internship not found.' };
        }
        // Check if already applied
        const existing = db.prepare(`
      SELECT id, status FROM applications WHERE user_id = ? AND internship_id = ?
    `).get(userId, internshipId);
        if (existing) {
            throw { status: 409, message: `You have already applied for this role. Current status: ${existing.status}.` };
        }
        // Compute explainable match snapshot
        const profile = ProfileService.getProfileByUserId(userId);
        const matchResult = MatchingService.calculateMatch(profile, internship);
        const result = db.prepare(`
      INSERT INTO applications (
        user_id, internship_id, status, cover_note, resume_used, match_score, match_reasons
      ) VALUES (?, ?, 'applied', ?, ?, ?, ?)
    `).run(userId, internshipId, coverNote || 'Application submitted via KaamSetu candidate portal.', profile.resume_filename || 'Default Profile Dossier', matchResult.score, JSON.stringify(matchResult));
        const appId = Number(result.lastInsertRowid);
        return this.getApplicationById(userId, appId);
    }
    /**
     * Get a single application ensuring ownership.
     */
    static getApplicationById(userId, applicationId) {
        const row = db.prepare(`
      SELECT * FROM applications WHERE id = ? AND user_id = ?
    `).get(applicationId, userId);
        if (!row)
            return null;
        return {
            ...row,
            match_reasons: row.match_reasons ? JSON.parse(row.match_reasons) : null,
            internship: InternshipService.getById(row.internship_id) || undefined,
        };
    }
    /**
     * List candidate's applications.
     */
    static listApplications(userId) {
        const rows = db.prepare(`
      SELECT * FROM applications WHERE user_id = ? ORDER BY applied_at DESC
    `).all(userId);
        return rows.map((row) => ({
            ...row,
            match_reasons: row.match_reasons ? JSON.parse(row.match_reasons) : null,
            internship: InternshipService.getById(row.internship_id) || undefined,
        }));
    }
    /**
     * Update application status (enforcing ownership).
     */
    static updateStatus(userId, applicationId, status) {
        const existing = db.prepare('SELECT id FROM applications WHERE id = ? AND user_id = ?').get(applicationId, userId);
        if (!existing) {
            throw { status: 404, message: 'Application record not found or access denied.' };
        }
        db.prepare(`
      UPDATE applications SET status = ?, updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `).run(status, applicationId, userId);
        return this.getApplicationById(userId, applicationId);
    }
}
