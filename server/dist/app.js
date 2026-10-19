import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { db, initDatabase } from './db/index.js';
import { errorHandler } from './middleware/validate.js';
import { securityHeaders, createRateLimiter } from './middleware/security.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import internshipRoutes from './routes/internships.js';
import savedRoutes from './routes/saved.js';
import applicationRoutes from './routes/applications.js';
import mangaRoutes from './routes/manga.js';
import chapterRoutes from './routes/chapters.js';
import bookmarkRoutes from './routes/bookmarks.js';
import reviewRoutes from './routes/reviews.js';
import statsRoutes from './routes/stats.js';
// Initialize SQLite database tables, indexes & seed data
initDatabase();
export const app = express();
// 1. Security Headers
app.use(securityHeaders);
// 2. CORS configuration
app.use(cors({
    origin: [config.clientUrl, 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// 3. Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// 4. General API Rate Limiter (300 requests per 15 minutes)
const globalLimiter = createRateLimiter({
    windowMs: config.rateLimitWindowMs || 15 * 60 * 1000,
    maxRequests: config.rateLimitMaxRequests || 300,
});
app.use('/api', globalLimiter);
// 5. Request logger
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        if (config.nodeEnv !== 'test') {
            console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
        }
    });
    next();
});
// 6. Health check endpoints
const getHealthStatus = () => {
    let dbStatus = 'healthy';
    try {
        db.prepare('SELECT 1').get();
    }
    catch {
        dbStatus = 'degraded';
    }
    return {
        status: dbStatus === 'healthy' ? 'healthy' : 'degraded',
        service: 'kaamsutra-api',
        platform: 'KaamSutra // कामसूत्र Career & Internship Platform',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        database: dbStatus,
    };
};
app.get('/health', (req, res) => {
    res.json(getHealthStatus());
});
app.get('/api/v1/health', (req, res) => {
    res.json(getHealthStatus());
});
// 7. Mount KaamSutra Phase 2 Career Portal Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/internships', internshipRoutes);
app.use('/api/v1/saved', savedRoutes);
app.use('/api/v1/applications', applicationRoutes);
// 8. Mount preserved legacy routes for backward compatibility
app.use('/api/v1/manga', mangaRoutes);
app.use('/api/v1/chapters', chapterRoutes);
app.use('/api/v1/bookmarks', bookmarkRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/stats', statsRoutes);
// 9. API 404 handler
app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        error: `API endpoint ${req.method} ${req.originalUrl} not found.`,
    });
});
// 10. Serve frontend build in production / unified deployment
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../../client/dist');
if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(clientDistPath, 'index.html'));
    });
}
else {
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            error: `Route ${req.method} ${req.originalUrl} not found.`,
        });
    });
}
// 11. Global error handler
app.use(errorHandler);
