import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { db } from '../src/db/index.js';
import { MatchingService } from '../src/services/matchingService.js';
import { Internship, CandidateProfile } from '../src/types/index.js';

describe('Kaamsetu Phase 2 — Production Backend Test Suite', () => {
  const timestamp = Date.now();
  const testCandidateEmail = `candidate_${timestamp}@kaamsetu.test`;
  const testCandidateUsername = `testcandidate_${timestamp}`;
  const testPassword = 'StrongPassword123!';
  let candidateToken = '';
  let candidateUserId = 0;

  const testCandidate2Email = `candidate2_${timestamp}@kaamsetu.test`;
  const testCandidate2Username = `candidate2_${timestamp}`;
  let candidate2Token = '';
  let candidate2UserId = 0;

  let seededInternshipId = 0;

  beforeAll(() => {
    // Get seeded internship
    const internship = db.prepare('SELECT id FROM internships LIMIT 1').get() as { id: number };
    seededInternshipId = internship.id;
  });

  describe('1. Security Headers & Health Check', () => {
    it('sets standard security headers on API responses', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('DENY');
      expect(res.headers['strict-transport-security']).toBeDefined();
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toBe('kaamsetu-api');
    });
  });

  describe('2. Authentication & Candidate Accounts', () => {
    it('registers candidate with hashed password and initialized profile', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        username: testCandidateUsername,
        email: testCandidateEmail,
        password: testPassword,
        role: 'candidate',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(testCandidateEmail);

      candidateToken = res.body.data.token;
      candidateUserId = res.body.data.user.id;

      // Verify in DB that plaintext password was NEVER stored
      const dbRow = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(candidateUserId) as any;
      expect(dbRow.password_hash).not.toBe(testPassword);
      expect(dbRow.password_hash).toMatch(/^\$2[aby]\$\d+\$/);
    });

    it('rejects duplicate registration with 409 conflict', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        username: testCandidateUsername,
        email: testCandidateEmail,
        password: testPassword,
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('logs in candidate and returns signed JWT token', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        emailOrUsername: testCandidateEmail,
        password: testPassword,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('rejects invalid password with privacy-preserving error', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        emailOrUsername: testCandidateEmail,
        password: 'WrongPassword!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Invalid credentials');
    });

    it('fetches candidate info on /api/v1/auth/me with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(testCandidateEmail);
      expect(res.body.data.candidateProfile).toBeDefined();
    });

    it('rejects unauthorized request without token', async () => {
      const res = await request(app).get('/api/v1/profile');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('registers second candidate for cross-candidate isolation testing', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        username: testCandidate2Username,
        email: testCandidate2Email,
        password: testPassword,
        role: 'candidate',
      });

      expect(res.status).toBe(201);
      candidate2Token = res.body.data.token;
      candidate2UserId = res.body.data.user.id;
    });
  });

  describe('3. Candidate Profile Management & Ownership', () => {
    it('retrieves candidate profile with calculated readiness score', async () => {
      const res = await request(app)
        .get('/api/v1/profile')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user_id).toBe(candidateUserId);
      expect(res.body.data.readiness_score).toBeGreaterThan(0);
    });

    it('updates candidate profile and recomputes readiness score', async () => {
      const res = await request(app)
        .put('/api/v1/profile')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          full_name: 'Aryan Ranjan',
          headline: 'Full Stack & AI Engineer',
          bio: 'Building next-gen systems and high-contrast editorial developer platforms.',
          current_location: 'Bengaluru, India',
          preferred_locations: ['Bengaluru', 'Remote'],
          work_modes: ['Remote', 'Hybrid'],
          experience_level: 'Fresher / Student',
          current_institution: 'Apex Engineering Institute',
          graduation_year: 2025,
          degree: 'B.Tech',
          field_of_study: 'Computer Science',
          cgpa: 8.9,
          skills: ['TypeScript', 'React', 'Node.js', 'Python', 'PyTorch', 'Go'],
          portfolio_url: 'https://aryanranjan03.vercel.app',
          github_url: 'https://github.com/aryan-r03',
          preferred_roles: ['Full Stack Developer', 'AI / ML Engineer'],
          min_stipend_expected: 40000,
          availability_months: 6,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.full_name).toBe('Aryan Ranjan');
      expect(res.body.data.skills).toContain('TypeScript');
      expect(res.body.data.readiness_score).toBeGreaterThanOrEqual(70);
    });
  });

  describe('4. Secure Private Résumé Upload & Access', () => {
    it('rejects non-PDF files', async () => {
      const res = await request(app)
        .post('/api/v1/profile/resume')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          filename: 'malicious.exe',
          base64Data: Buffer.from('malicious payload').toString('base64'),
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Only PDF documents');
    });

    it('rejects invalid PDF without %PDF- magic signature', async () => {
      const res = await request(app)
        .post('/api/v1/profile/resume')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          filename: 'fake.pdf',
          base64Data: Buffer.from('this is not a real pdf').toString('base64'),
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('File signature does not match');
    });

    it('accepts valid PDF with %PDF- header and stores safely in private storage', async () => {
      const validPdfBuffer = Buffer.from('%PDF-1.4\n%Candidate CV content mock\n%%EOF');
      const res = await request(app)
        .post('/api/v1/profile/resume')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          filename: 'Aryan_Ranjan_Resume.pdf',
          base64Data: validPdfBuffer.toString('base64'),
        });

      expect(res.status).toBe(201);
      expect(res.body.data.filename).toBe('Aryan_Ranjan_Resume.pdf');
      expect(res.body.data.profile.resume_filename).toBe('Aryan_Ranjan_Resume.pdf');
    });

    it('allows candidate to download their own stored résumé', async () => {
      const res = await request(app)
        .get('/api/v1/profile/resume')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('application/pdf');
    });
  });

  describe('5. Internship Discovery & Data Integrity', () => {
    it('returns seeded mock internships with explicit is_mock_data = true', async () => {
      const res = await request(app).get('/api/v1/internships');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      for (const item of res.body.data) {
        expect(item.is_mock_data).toBe(true);
        expect(item.title).toBeDefined();
        expect(item.company_name).toBeDefined();
      }
    });

    it('filters internships by category', async () => {
      const res = await request(app).get('/api/v1/internships?category=AI / Machine Learning');
      expect(res.status).toBe(200);
      for (const item of res.body.data) {
        expect(item.category).toBe('AI / Machine Learning');
      }
    });

    it('filters internships by work mode', async () => {
      const res = await request(app).get('/api/v1/internships?workMode=Remote');
      expect(res.status).toBe(200);
      for (const item of res.body.data) {
        expect(item.work_mode.toLowerCase()).toBe('remote');
      }
    });

    it('fetches specific internship detail by ID', async () => {
      const res = await request(app).get(`/api/v1/internships/${seededInternshipId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(seededInternshipId);
      expect(res.body.data.requirements.length).toBeGreaterThan(0);
    });
  });

  describe('6. Bookmarks & Application Tracking', () => {
    it('bookmarks an internship for candidate 1', async () => {
      const res = await request(app)
        .post(`/api/v1/saved/${seededInternshipId}`)
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('retrieves saved internships for candidate 1', async () => {
      const res = await request(app)
        .get('/api/v1/saved')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.some((s: any) => s.internship_id === seededInternshipId)).toBe(true);
    });

    it('verifies candidate 2 does NOT see candidate 1 saved bookmarks', async () => {
      const res = await request(app)
        .get('/api/v1/saved')
        .set('Authorization', `Bearer ${candidate2Token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(0);
    });

    it('submits application with snapshot match score', async () => {
      const res = await request(app)
        .post(`/api/v1/applications/${seededInternshipId}`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          coverNote: 'Excited to contribute to vision systems and low-latency runtimes.',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('applied');
      expect(res.body.data.match_score).toBeGreaterThanOrEqual(0);
      expect(res.body.data.match_reasons).toBeDefined();
    });

    it('prevents duplicate application submission', async () => {
      const res = await request(app)
        .post(`/api/v1/applications/${seededInternshipId}`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ coverNote: 'Duplicate attempt' });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('already applied');
    });

    it('allows candidate to update application status to in_review', async () => {
      const listRes = await request(app)
        .get('/api/v1/applications')
        .set('Authorization', `Bearer ${candidateToken}`);

      const appId = listRes.body.data[0].id;
      const res = await request(app)
        .patch(`/api/v1/applications/${appId}/status`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ status: 'in_review' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('in_review');
    });

    it('prevents candidate 2 from modifying candidate 1 application status', async () => {
      const listRes = await request(app)
        .get('/api/v1/applications')
        .set('Authorization', `Bearer ${candidateToken}`);

      const appId = listRes.body.data[0].id;
      const res = await request(app)
        .patch(`/api/v1/applications/${appId}/status`)
        .set('Authorization', `Bearer ${candidate2Token}`)
        .send({ status: 'offer' });

      expect(res.status).toBe(404);
    });
  });

  describe('7. Explainable Matching Engine Algorithm', () => {
    const sampleInternship: Internship = {
      id: 999,
      title: 'Full Stack Engineer Intern',
      slug: 'fullstack-engineer-intern',
      company_name: 'Test Labs',
      company_logo: 'https://test.logo',
      category: 'Engineering',
      role_type: 'Internship',
      work_mode: 'Remote',
      location: 'Remote',
      stipend_min: 40000,
      stipend_max: 50000,
      stipend_period: 'month',
      ppo_offered: true,
      duration_months: 6,
      experience_level: 'Students & Freshers',
      description: 'Test description',
      responsibilities: ['Build features'],
      requirements: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      preferred_qualifications: ['Docker'],
      perks: ['Mentorship'],
      eligible_batches: [2025, 2026],
      eligible_degrees: ['B.Tech', 'B.E.', 'MCA'],
      min_cgpa: 7.0,
      is_mock_data: true,
      is_active: true,
      deadline: '2026-12-31',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it('computes high match score when skills, degree, batch, and work mode align', () => {
      const candidate: Partial<CandidateProfile> = {
        skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
        graduation_year: 2025,
        degree: 'B.Tech',
        field_of_study: 'Computer Science',
        cgpa: 8.5,
        preferred_roles: ['Full Stack Engineer', 'Frontend'],
        work_modes: ['Remote'],
        current_location: 'Remote',
      };

      const result = MatchingService.calculateMatch(candidate, sampleInternship);
      expect(result.score).toBeGreaterThanOrEqual(80);
      expect(result.verdict).toBe('Excellent Match');
      expect(result.matchedSkills).toEqual(['TypeScript', 'React', 'Node.js', 'PostgreSQL']);
      expect(result.missingSkills.length).toBe(0);
      expect(result.eligibilityIssues.length).toBe(0);
      expect(result.breakdown.skillsScore).toBe(40);
    });

    it('identifies missing skills and penalizes skills score proportionally', () => {
      const candidate: Partial<CandidateProfile> = {
        skills: ['TypeScript', 'React'], // Missing Node.js and PostgreSQL
        graduation_year: 2025,
        degree: 'B.Tech',
        cgpa: 8.0,
        preferred_roles: ['Engineering'],
        work_modes: ['Remote'],
      };

      const result = MatchingService.calculateMatch(candidate, sampleInternship);
      expect(result.matchedSkills).toEqual(['TypeScript', 'React']);
      expect(result.missingSkills).toEqual(['Node.js', 'PostgreSQL']);
      expect(result.breakdown.skillsScore).toBe(20); // 2 of 4 -> 50% of 40 = 20
    });

    it('flags eligibility concerns for ineligible batch year', () => {
      const candidate: Partial<CandidateProfile> = {
        skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
        graduation_year: 2023, // Ineligible: internship requires 2025 or 2026
        degree: 'B.Tech',
        cgpa: 8.0,
      };

      const result = MatchingService.calculateMatch(candidate, sampleInternship);
      expect(result.eligibilityIssues.some((issue) => issue.includes('Graduation year 2023'))).toBe(true);
      expect(result.breakdown.eligibilityScore).toBeLessThan(25);
    });

    it('flags CGPA below minimum requirement', () => {
      const candidate: Partial<CandidateProfile> = {
        skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
        graduation_year: 2025,
        degree: 'B.Tech',
        cgpa: 6.2, // Below 7.0
      };

      const result = MatchingService.calculateMatch(candidate, sampleInternship);
      expect(result.eligibilityIssues.some((issue) => issue.includes('below minimum required'))).toBe(true);
    });

    it('safely handles missing or empty profile without errors', () => {
      const result = MatchingService.calculateMatch(null, sampleInternship);
      expect(result.score).toBe(0);
      expect(result.verdict).toBe('Low Match');
      expect(result.eligibilityIssues.length).toBeGreaterThan(0);
    });
  });
});
