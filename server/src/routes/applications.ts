import { Router, Response } from 'express';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { ApplicationService } from '../services/applicationService.js';

const router = Router();

const applyBodySchema = z.object({
  coverNote: z.string().max(2000).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['interested', 'applied', 'in_review', 'interview', 'rejected', 'offer']),
});

// GET /api/v1/applications - List candidate applications
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const list = ApplicationService.listApplications(req.user!.userId);
    res.json({
      success: true,
      data: list,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/applications/:internshipId - Submit application
router.post(
  '/:internshipId',
  requireAuth,
  validateBody(applyBodySchema),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const rawId = Array.isArray(req.params.internshipId) ? req.params.internshipId[0] : req.params.internshipId;
      const internshipId = parseInt(rawId, 10);
      if (isNaN(internshipId)) {
        res.status(400).json({ success: false, error: 'Invalid internship ID.' });
        return;
      }

      const application = ApplicationService.apply(req.user!.userId, internshipId, req.body.coverNote);
      res.status(201).json({
        success: true,
        message: 'Application submitted successfully with match snapshot.',
        data: application,
      });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/v1/applications/:id/status - Update application status
router.patch(
  '/:id/status',
  requireAuth,
  validateBody(updateStatusSchema),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const rawAppId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const appId = parseInt(rawAppId, 10);
      if (isNaN(appId)) {
        res.status(400).json({ success: false, error: 'Invalid application ID.' });
        return;
      }

      const updated = ApplicationService.updateStatus(req.user!.userId, appId, req.body.status);
      res.json({
        success: true,
        message: `Application status updated to ${req.body.status}.`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
