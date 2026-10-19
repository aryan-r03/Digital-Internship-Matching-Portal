import { Router } from 'express';
import { StatsService } from '../services/statsService.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.get('/', async (req, res, next) => {
    try {
        const stats = StatsService.getPlatformStats();
        res.json({
            success: true,
            data: stats,
        });
    }
    catch (err) {
        next(err);
    }
});
router.get('/me', requireAuth, async (req, res, next) => {
    try {
        const stats = StatsService.getUserStats(req.user.userId);
        res.json({
            success: true,
            data: stats,
        });
    }
    catch (err) {
        next(err);
    }
});
export default router;
