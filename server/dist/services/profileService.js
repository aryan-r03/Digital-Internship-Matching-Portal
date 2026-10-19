import { db } from '../db/index.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class ProfileService {
    /**
     * Calculate dynamic readiness score based on profile completeness.
     */
    static calculateReadiness(profile) {
        let score = 0;
        // Contact and Bio (15 pts)
        if (profile.full_name && profile.full_name.trim().length > 2)
            score += 5;
        if (profile.bio && profile.bio.trim().length > 20)
            score += 10;
        // Skills (25 pts)
        const skills = profile.skills || [];
        if (skills.length >= 5)
            score += 25;
        else if (skills.length >= 3)
            score += 15;
        else if (skills.length >= 1)
            score += 5;
        // Education & Academic Background (20 pts)
        if (profile.current_institution && profile.degree)
            score += 10;
        if (profile.graduation_year && profile.graduation_year >= 2020)
            score += 5;
        if (profile.cgpa && profile.cgpa >= 5.0)
            score += 5;
        // Links & Showcase (20 pts)
        if (profile.github_url && profile.github_url.trim().length > 5)
            score += 10;
        if (profile.portfolio_url && profile.portfolio_url.trim().length > 5)
            score += 10;
        // Résumé (20 pts)
        if (profile.resume_filename && profile.resume_filename.trim().length > 0)
            score += 20;
        return Math.min(100, score);
    }
    /**
     * Helper to deserialize SQLite row into typed CandidateProfile
     */
    static formatProfileRow(row) {
        return {
            ...row,
            preferred_locations: JSON.parse(row.preferred_locations || '[]'),
            work_modes: JSON.parse(row.work_modes || '[]'),
            skills: JSON.parse(row.skills || '[]'),
            preferred_roles: JSON.parse(row.preferred_roles || '[]'),
            readiness_score: Number(row.readiness_score || 0),
        };
    }
    /**
     * Retrieve candidate profile for a given user. Creates default if none exists yet.
     */
    static getProfileByUserId(userId) {
        const row = db.prepare('SELECT * FROM candidate_profiles WHERE user_id = ?').get(userId);
        if (row) {
            return this.formatProfileRow(row);
        }
        // Fetch user details to pre-populate name
        const user = db.prepare('SELECT username, email FROM users WHERE id = ?').get(userId);
        const defaultName = user ? user.username : 'Candidate';
        const defaultProfile = {
            user_id: userId,
            full_name: defaultName,
            headline: 'Aspiring Software & AI Engineer',
            bio: 'Enthusiastic candidate focused on building high-performance systems and user-centric interfaces.',
            phone: '+91 98765 43210',
            current_location: 'Bengaluru, India',
            preferred_locations: JSON.stringify(['Bengaluru', 'Remote', 'Hyderabad', 'Gurugram']),
            work_modes: JSON.stringify(['Remote', 'Hybrid']),
            experience_level: 'Fresher / Student',
            current_institution: 'National Institute of Technology',
            graduation_year: 2025,
            degree: 'B.Tech / B.E.',
            field_of_study: 'Computer Science & Engineering',
            cgpa: 8.5,
            skills: JSON.stringify(['TypeScript', 'React', 'Node.js', 'Python', 'Tailwind CSS']),
            portfolio_url: 'https://aryanranjan03.vercel.app',
            github_url: 'https://github.com/aryan-r03',
            linkedin_url: 'https://linkedin.com/in/aryanranjan',
            resume_filename: null,
            resume_path: null,
            preferred_roles: JSON.stringify(['Full Stack Developer', 'Frontend Developer', 'AI / ML Engineer']),
            min_stipend_expected: 35000,
            availability_months: 6,
            readiness_score: 75,
        };
        db.prepare(`
      INSERT INTO candidate_profiles (
        user_id, full_name, headline, bio, phone, current_location,
        preferred_locations, work_modes, experience_level, current_institution,
        graduation_year, degree, field_of_study, cgpa, skills,
        portfolio_url, github_url, linkedin_url, resume_filename, resume_path,
        preferred_roles, min_stipend_expected, availability_months, readiness_score
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `).run(defaultProfile.user_id, defaultProfile.full_name, defaultProfile.headline, defaultProfile.bio, defaultProfile.phone, defaultProfile.current_location, defaultProfile.preferred_locations, defaultProfile.work_modes, defaultProfile.experience_level, defaultProfile.current_institution, defaultProfile.graduation_year, defaultProfile.degree, defaultProfile.field_of_study, defaultProfile.cgpa, defaultProfile.skills, defaultProfile.portfolio_url, defaultProfile.github_url, defaultProfile.linkedin_url, defaultProfile.resume_filename, defaultProfile.resume_path, defaultProfile.preferred_roles, defaultProfile.min_stipend_expected, defaultProfile.availability_months, defaultProfile.readiness_score);
        return this.getProfileByUserId(userId);
    }
    /**
     * Update candidate profile with ownership enforcement.
     */
    static updateProfile(userId, input) {
        // Ensure profile exists first
        const current = this.getProfileByUserId(userId);
        const merged = {
            ...current,
            ...input,
        };
        const calculatedReadiness = this.calculateReadiness(merged);
        db.prepare(`
      UPDATE candidate_profiles SET
        full_name = ?,
        headline = ?,
        bio = ?,
        phone = ?,
        current_location = ?,
        preferred_locations = ?,
        work_modes = ?,
        experience_level = ?,
        current_institution = ?,
        graduation_year = ?,
        degree = ?,
        field_of_study = ?,
        cgpa = ?,
        skills = ?,
        portfolio_url = ?,
        github_url = ?,
        linkedin_url = ?,
        preferred_roles = ?,
        min_stipend_expected = ?,
        availability_months = ?,
        readiness_score = ?,
        updated_at = datetime('now')
      WHERE user_id = ?
    `).run(merged.full_name, merged.headline || null, merged.bio || null, merged.phone || null, merged.current_location, JSON.stringify(merged.preferred_locations || []), JSON.stringify(merged.work_modes || []), merged.experience_level, merged.current_institution || null, merged.graduation_year, merged.degree, merged.field_of_study, merged.cgpa, JSON.stringify(merged.skills || []), merged.portfolio_url || null, merged.github_url || null, merged.linkedin_url || null, JSON.stringify(merged.preferred_roles || []), merged.min_stipend_expected, merged.availability_months, calculatedReadiness, userId);
        return this.getProfileByUserId(userId);
    }
    /**
     * Attach securely uploaded résumé file metadata to profile.
     */
    static attachResume(userId, originalName, storageFilename, filePath, sizeBytes) {
        // Store in resumes table
        db.prepare(`
      INSERT INTO resumes (user_id, original_filename, storage_filename, mime_type, size_bytes, file_path)
      VALUES (?, ?, ?, 'application/pdf', ?, ?)
    `).run(userId, originalName, storageFilename, sizeBytes, filePath);
        // Update profile
        db.prepare(`
      UPDATE candidate_profiles
      SET resume_filename = ?, resume_path = ?, updated_at = datetime('now')
      WHERE user_id = ?
    `).run(originalName, filePath, userId);
        // Recalculate readiness
        const updated = this.getProfileByUserId(userId);
        const newReadiness = this.calculateReadiness(updated);
        db.prepare(`
      UPDATE candidate_profiles SET readiness_score = ? WHERE user_id = ?
    `).run(newReadiness, userId);
        return this.getProfileByUserId(userId);
    }
    /**
     * Get candidate's résumé file record for download.
     */
    static getResumeFile(userId) {
        const profile = db.prepare('SELECT resume_path, resume_filename FROM candidate_profiles WHERE user_id = ?').get(userId);
        if (!profile || !profile.resume_path || !fs.existsSync(profile.resume_path)) {
            return null;
        }
        return {
            filePath: profile.resume_path,
            originalFilename: profile.resume_filename || 'Candidate_Resume.pdf',
        };
    }
}
