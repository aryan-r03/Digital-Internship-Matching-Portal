import { Router } from 'express';
import { z } from 'zod';
import { BookmarkService } from '../services/bookmarkService.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

const bookmarkSchema = z.object({
  manga_id: z.number().int().min(1),
  status: z.enum(['reading', 'plan_to_read', 'completed', 'dropped']),
});

router.get('/', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const status = req.query.status as string | undefined;
    const library = BookmarkService.getUserLibrary(req.user!.userId, status);
    res.json({
      success: true,
      data: library,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, validateBody(bookmarkSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const bookmark = BookmarkService.upsertBookmark(
      req.user!.userId,
      req.body.manga_id,
      req.body.status
    );
    res.json({
      success: true,
      message: `Manga marked as ${req.body.status}.`,
      data: bookmark,
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:mangaId', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const mangaId = parseInt(String(req.params.mangaId), 10);
    const result = BookmarkService.removeBookmark(req.user!.userId, mangaId);
    res.json({
      success: true,
      message: 'Removed from library.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
