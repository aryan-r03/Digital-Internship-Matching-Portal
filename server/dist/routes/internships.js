import { Router } from 'express';
import { z } from 'zod';
import { InternshipService } from '../services/internshipService.js';
import { MatchingService } from '../services/matchingService.js';
import { ProfileService } from '../services/profileService.js';
import { providerRegistry } from '../services/providers/providerRegistry.js';
import { optionalAuth } from '../middleware/auth.js';
import { validateQuery } from '../middleware/validate.js';
const router = Router();
const filterQuerySchema = z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    workMode: z.string().optional(),
    roleType: z.string().optional(),
    minStipend: z.coerce.number().optional(),
    ppoOnly: z.enum(['true', 'false', '1', '0']).optional().transform((val) => val === 'true' || val === '1'),
    source: z.enum(['all', 'live', 'demo']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(30),
    sort: z.enum(['newest', 'stipend', 'deadline']).default('newest'),
});
// GET /api/v1/internships/sources/status - Real-time external provider health, counts, and attribution
router.get('/sources/status', async (req, res) => {
    res.json({
        success: true,
        data: providerRegistry.getProviderStatuses(),
    });
});
// GET /api/v1/internships - Discover and filter internships (merged verified feeds & demo records)
router.get('/', validateQuery(filterQuerySchema), async (req, res, next) => {
    try {
        const query = req.query;
        const source = query.source || (process.env.NODE_ENV === 'test' ? 'demo' : 'all');
        let liveItems = [];
        if (source === 'all' || source === 'live') {
            try {
                liveItems = await providerRegistry.getAggregatedListings({
                    search: query.search,
                    category: query.category,
                    workMode: query.workMode,
                    minStipend: query.minStipend,
                });
            }
            catch (err) {
                console.warn('[Internships API] Provider aggregation warning:', err?.message);
                liveItems = [];
            }
        }
        let demoResult = { data: [], total: 0 };
        if (source === 'all' || source === 'demo') {
            demoResult = InternshipService.list(query);
        }
        let combined = [];
        if (source === 'live') {
            combined = liveItems;
        }
        else if (source === 'demo') {
            combined = demoResult.data;
        }
        else {
            // 'all': place live verified opportunities first, followed by demo records
            combined = [...liveItems, ...demoResult.data];
        }
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 30;
        const total = combined.length;
        const startIndex = (page - 1) * limit;
        const paginated = combined.slice(startIndex, startIndex + limit);
        res.json({
            success: true,
            data: paginated,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit) || 1,
            },
            sources: {
                liveCount: liveItems.length,
                demoCount: demoResult.data.length,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/v1/internships/:id - Internship details
router.get('/:id', async (req, res, next) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        // 1. Check external providers if ID is external (e.g. remoteok-..., adzuna-...)
        if (rawId.startsWith('remoteok-') || rawId.startsWith('adzuna-')) {
            const extItem = await providerRegistry.getListingById(rawId);
            if (extItem) {
                res.json({ success: true, data: extItem });
                return;
            }
        }
        // 2. Resolve in local database by integer ID or slug
        const id = parseInt(rawId, 10);
        if (isNaN(id)) {
            const bySlug = InternshipService.getBySlug(rawId);
            if (bySlug) {
                res.json({ success: true, data: bySlug });
                return;
            }
            // Check external registry by slug as well
            const extBySlug = await providerRegistry.getListingById(rawId);
            if (extBySlug) {
                res.json({ success: true, data: extBySlug });
                return;
            }
            res.status(404).json({ success: false, error: 'Internship not found.' });
            return;
        }
        const internship = InternshipService.getById(id);
        if (!internship) {
            res.status(404).json({ success: false, error: 'Internship not found.' });
            return;
        }
        res.json({ success: true, data: internship });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/v1/internships/:id/match - Explainable match score between candidate profile and internship
router.get('/:id/match', optionalAuth, async (req, res, next) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        let internship = null;
        if (rawId.startsWith('remoteok-') || rawId.startsWith('adzuna-')) {
            internship = await providerRegistry.getListingById(rawId);
        }
        else {
            const id = parseInt(rawId, 10);
            internship = isNaN(id) ? InternshipService.getBySlug(rawId) : InternshipService.getById(id);
        }
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
    }
    catch (err) {
        next(err);
    }
});
export default router;
