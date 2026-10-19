import { Router } from 'express';
import { z } from 'zod';
import { MangaService } from '../services/mangaService.js';
import { requireAuth, optionalAuth, requireRole } from '../middleware/auth.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
const router = Router();
const mangaQuerySchema = z.object({
    search: z.string().optional(),
    genre: z.string().optional(),
    demographic: z.string().optional(),
    status: z.string().optional(),
    sort: z.enum(['trending', 'top_rated', 'newest', 'alphabetical']).optional(),
    limit: z.coerce.number().min(1).max(100).default(20),
    offset: z.coerce.number().min(0).default(0),
});
const createMangaSchema = z.object({
    title: z.string().min(1, 'Title is required').max(150),
    japanese_title: z.string().max(150).optional(),
    synopsis: z.string().min(10, 'Synopsis must be at least 10 characters'),
    cover_image: z.string().url('Cover image must be a valid URL'),
    banner_image: z.string().url('Banner image must be a valid URL').optional(),
    author: z.string().min(1, 'Author is required'),
    artist: z.string().min(1, 'Artist is required'),
    status: z.enum(['Ongoing', 'Completed', 'Hiatus']).default('Ongoing'),
    demographic: z.enum(['Shonen', 'Seinen', 'Shojo', 'Josei']).default('Shonen'),
    release_year: z.number().int().min(1950).max(2030).default(new Date().getFullYear()),
    genres: z.array(z.string()).min(1, 'Select at least one genre'),
    is_featured: z.boolean().optional(),
});
router.get('/', validateQuery(mangaQuerySchema), async (req, res, next) => {
    try {
        const result = MangaService.list(req.query);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
router.get('/featured', async (req, res, next) => {
    try {
        const featured = MangaService.getFeatured();
        res.json({
            success: true,
            data: featured,
        });
    }
    catch (err) {
        next(err);
    }
});
router.get('/:slug', optionalAuth, async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const manga = MangaService.getBySlug(String(req.params.slug), userId);
        res.json({
            success: true,
            data: manga,
        });
    }
    catch (err) {
        next(err);
    }
});
router.post('/', requireAuth, requireRole(['creator', 'admin']), validateBody(createMangaSchema), async (req, res, next) => {
    try {
        const created = MangaService.create({
            ...req.body,
            creator_id: req.user.userId,
        });
        res.status(201).json({
            success: true,
            message: 'Manga series published successfully.',
            data: created,
        });
    }
    catch (err) {
        next(err);
    }
});
router.put('/:id', requireAuth, requireRole(['creator', 'admin']), async (req, res, next) => {
    try {
        const mangaId = parseInt(String(req.params.id), 10);
        const updated = MangaService.update(mangaId, req.body, req.user.userId, req.user.role);
        res.json({
            success: true,
            message: 'Manga series updated successfully.',
            data: updated,
        });
    }
    catch (err) {
        next(err);
    }
});
router.delete('/:id', requireAuth, requireRole(['creator', 'admin']), async (req, res, next) => {
    try {
        const mangaId = parseInt(String(req.params.id), 10);
        const result = MangaService.delete(mangaId, req.user.userId, req.user.role);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
export default router;
