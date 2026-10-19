import { Router } from 'express';
import { z } from 'zod';
import { ReviewService } from '../services/reviewService.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

const reviewSchema = z.object({
  rating_story: z.number().int().min(1).max(5),
  rating_art: z.number().int().min(1).max(5),
  rating_characters: z.number().int().min(1).max(5),
  title: z.string().min(2, 'Title must be at least 2 characters').max(100),
  content: z.string().min(10, 'Review must be at least 10 characters').max(2000),
});

router.get('/:mangaId', async (req, res, next) => {
  try {
    const mangaId = parseInt(String(req.params.mangaId), 10);
    const reviews = ReviewService.getMangaReviews(mangaId);
    res.json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/:mangaId', requireAuth, validateBody(reviewSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const mangaId = parseInt(String(req.params.mangaId), 10);
    const review = ReviewService.upsertReview(req.user!.userId, mangaId, req.body);
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      data: review,
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:mangaId', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const mangaId = parseInt(String(req.params.mangaId), 10);
    const result = ReviewService.deleteReview(req.user!.userId, mangaId);
    res.json({
      success: true,
      message: 'Review deleted.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/:reviewId/like', async (req, res, next) => {
  try {
    const reviewId = parseInt(String(req.params.reviewId), 10);
    const result = ReviewService.likeReview(reviewId);
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
