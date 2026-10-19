import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { InternshipService } from '../services/internshipService.js';
import { MatchingService } from '../services/matchingService.js';
import { ProfileService } from '../services/profileService.js';
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { validateQuery } from '../middleware/validate.js';

const router = Router();

const filterQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  workMode: z.string().optional(),
  roleType: z.string().optional(),
  minStipend: z.coerce.number().optional(),
  ppoOnly: z.enum(['true', 'false', '1', '0']).optional().transform((val) => val === 'true' || val === '1'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  sort: z.enum(['newest', 'stipend', 'deadline']).default('newest'),
});

// GET /api/v1/internships - Discover and filter internships
router.get('/', validateQuery(filterQuerySchema), async (req: Request, res: Response, next) => {
  try {
    const result = InternshipService.list(req.query as any);
    res.json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/internships/:id - Internship details
router.get('/:id', async (req: Request, res: Response, next) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      // Try resolving by slug
      const bySlug = InternshipService.getBySlug(rawId);
      if (!bySlug) {
        res.status(404).json({ success: false, error: 'Internship not found.' });
        return;
      }
      res.json({ success: true, data: bySlug });
      return;
    }

    const internship = InternshipService.getById(id);
    if (!internship) {
      res.status(404).json({ success: false, error: 'Internship not found.' });
      return;
    }

    res.json({ success: true, data: internship });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/internships/:id/match - Explainable match score between candidate profile and internship
router.get('/:id/match', optionalAuth, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId, 10);
    const internship = isNaN(id) ? InternshipService.getBySlug(rawId) : InternshipService.getById(id);

    if (!internship) {
      res.status(404).json({ success: false, error: 'Internship not found.' });
      return;
    }

    let profile = null;
    if (req.user) {
      profile = ProfileService.getProfileByUserId(req.user.userId);
    }

    const matchResult = MatchingService.calculateMatch(profile, internship);
    res.json({
      success: true,
      data: matchResult,
      isSimulated: !req.user,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
