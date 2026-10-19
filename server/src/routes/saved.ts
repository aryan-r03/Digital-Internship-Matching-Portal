import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { ApplicationService } from '../services/applicationService.js';

const router = Router();

// GET /api/v1/saved - List saved internships for authenticated candidate
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const list = ApplicationService.listSaved(req.user!.userId);
    res.json({
      success: true,
      data: list,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/saved/:internshipId - Save / bookmark an internship
router.post('/:internshipId', requireAuth, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const rawId = Array.isArray(req.params.internshipId) ? req.params.internshipId[0] : req.params.internshipId;
    const internshipId = parseInt(rawId, 10);
    if (isNaN(internshipId)) {
      res.status(400).json({ success: false, error: 'Invalid internship ID.' });
      return;
    }

    ApplicationService.saveInternship(req.user!.userId, internshipId);
    res.status(201).json({
      success: true,
      message: 'Internship bookmarked successfully.',
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/saved/:internshipId - Unsave / remove bookmark
router.delete('/:internshipId', requireAuth, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const rawId = Array.isArray(req.params.internshipId) ? req.params.internshipId[0] : req.params.internshipId;
    const internshipId = parseInt(rawId, 10);
    if (isNaN(internshipId)) {
      res.status(400).json({ success: false, error: 'Invalid internship ID.' });
      return;
    }

    ApplicationService.unsaveInternship(req.user!.userId, internshipId);
    res.json({
      success: true,
      message: 'Bookmark removed successfully.',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
