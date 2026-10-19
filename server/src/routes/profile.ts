import { Router, Response } from 'express';
import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { ProfileService } from '../services/profileService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PRIVATE_STORAGE_DIR = path.resolve(__dirname, '../../private_storage/resumes');

// Ensure private storage directory exists
if (!fs.existsSync(PRIVATE_STORAGE_DIR)) {
  fs.mkdirSync(PRIVATE_STORAGE_DIR, { recursive: true });
}

const router = Router();

const profileUpdateSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(80),
  headline: z.string().max(120).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  phone: z.string().max(25).optional().nullable(),
  current_location: z.string().min(2).max(100),
  preferred_locations: z.array(z.string()).default([]),
  work_modes: z.array(z.enum(['Remote', 'Hybrid', 'Onsite'])).default(['Remote']),
  experience_level: z.string().default('Fresher / Student'),
  current_institution: z.string().max(120).optional().nullable(),
  graduation_year: z.number().int().min(2020).max(2035),
  degree: z.string().min(2).max(80),
  field_of_study: z.string().min(2).max(80),
  cgpa: z.number().min(0).max(10),
  skills: z.array(z.string()).default([]),
  portfolio_url: z.string().url().optional().nullable().or(z.literal('')),
  github_url: z.string().url().optional().nullable().or(z.literal('')),
  linkedin_url: z.string().url().optional().nullable().or(z.literal('')),
  preferred_roles: z.array(z.string()).default([]),
  min_stipend_expected: z.number().int().min(0).default(0),
  availability_months: z.number().int().min(1).max(24).default(6),
});

const resumeUploadSchema = z.object({
  filename: z.string().min(3).max(120),
  base64Data: z.string().min(10, 'Invalid file data'),
});

// GET /api/v1/profile - Get current candidate profile
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const profile = ProfileService.getProfileByUserId(req.user!.userId);
    res.json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/profile - Update candidate profile
router.put('/', requireAuth, validateBody(profileUpdateSchema), async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const updated = ProfileService.updateProfile(req.user!.userId, req.body);
    res.json({
      success: true,
      message: 'Candidate profile updated successfully.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/profile/resume - Secure résumé upload (stores in non-public private storage)
router.post('/resume', requireAuth, validateBody(resumeUploadSchema), async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { filename, base64Data } = req.body;

    // Sanitize filename
    const sanitizedOriginalName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
    if (!sanitizedOriginalName.toLowerCase().endsWith('.pdf')) {
      res.status(400).json({
        success: false,
        error: 'Only PDF documents (.pdf) are permitted.',
      });
      return;
    }

    // Decode base64 buffer
    const buffer = Buffer.from(base64Data.replace(/^data:application\/pdf;base64,/, ''), 'base64');

    // 5MB limit
    if (buffer.length > 5 * 1024 * 1024) {
      res.status(400).json({
        success: false,
        error: 'Résumé file exceeds the 5MB size limit.',
      });
      return;
    }

    // Magic bytes verification for PDF (%PDF-)
    const isPdfMagic = buffer.length >= 4 &&
      buffer[0] === 0x25 && // %
      buffer[1] === 0x50 && // P
      buffer[2] === 0x44 && // D
      buffer[3] === 0x46;   // F

    if (!isPdfMagic) {
      res.status(400).json({
        success: false,
        error: 'Invalid file format. File signature does not match a valid PDF document.',
      });
      return;
    }

    // Generate safe UUID storage filename
    const uniqueId = crypto.randomUUID();
    const storageFilename = `${req.user!.userId}_${uniqueId}.pdf`;
    const targetPath = path.join(PRIVATE_STORAGE_DIR, storageFilename);

    // Save to private storage
    fs.writeFileSync(targetPath, buffer);

    // Attach to profile and db
    const updatedProfile = ProfileService.attachResume(
      req.user!.userId,
      sanitizedOriginalName,
      storageFilename,
      targetPath,
      buffer.length
    );

    res.status(201).json({
      success: true,
      message: 'Résumé uploaded and verified successfully.',
      data: {
        filename: sanitizedOriginalName,
        sizeBytes: buffer.length,
        profile: updatedProfile,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/profile/resume - Download candidate's own stored résumé
router.get('/resume', requireAuth, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const fileInfo = ProfileService.getResumeFile(req.user!.userId);
    if (!fileInfo) {
      res.status(404).json({
        success: false,
        error: 'No résumé on file for this candidate.',
      });
      return;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileInfo.originalFilename}"`);
    res.sendFile(fileInfo.filePath);
  } catch (err) {
    next(err);
  }
});

export default router;
