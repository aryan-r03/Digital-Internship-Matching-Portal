import { Router } from 'express';
import { z } from 'zod';
import { ChapterService } from '../services/chapterService.js';
import { requireAuth, optionalAuth, requireRole } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
const router = Router();
const pageSchema = z.object({
    pageNumber: z.number().int().min(1),
    imageUrl: z.string().url(),
    caption: z.string().optional(),
});
const createChapterSchema = z.object({
    manga_id: z.number().int().min(1),
    chapter_number: z.number().min(0),
    title: z.string().min(1, 'Title is required').max(150),
    pages: z.array(pageSchema).min(1, 'At least one page is required'),
});
const commentSchema = z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(1000),
});
router.get('/:id', optionalAuth, async (req, res, next) => {
    try {
        const chapterId = parseInt(String(req.params.id), 10);
        const userId = req.user?.userId;
        const chapter = ChapterService.getById(chapterId, userId);
        res.json({
            success: true,
            data: chapter,
        });
    }
    catch (err) {
        next(err);
    }
});
router.post('/', requireAuth, requireRole(['creator', 'admin']), validateBody(createChapterSchema), async (req, res, next) => {
    try {
        const chapter = ChapterService.create(req.body.manga_id, {
            chapter_number: req.body.chapter_number,
            title: req.body.title,
            pages: req.body.pages,
        }, req.user.userId, req.user.role);
        res.status(201).json({
            success: true,
            message: 'Chapter published successfully.',
            data: chapter,
        });
    }
    catch (err) {
        next(err);
    }
});
router.get('/:id/comments', async (req, res, next) => {
    try {
        const chapterId = parseInt(String(req.params.id), 10);
        const comments = ChapterService.getComments(chapterId);
        res.json({
            success: true,
            data: comments,
        });
    }
    catch (err) {
        next(err);
    }
});
router.post('/:id/comments', requireAuth, validateBody(commentSchema), async (req, res, next) => {
    try {
        const chapterId = parseInt(String(req.params.id), 10);
        const comment = ChapterService.addComment(chapterId, req.user.userId, req.body.content);
        res.status(201).json({
            success: true,
            message: 'Comment posted successfully.',
            data: comment,
        });
    }
    catch (err) {
        next(err);
    }
});
export default router;
