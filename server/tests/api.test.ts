import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { runSeed } from '../src/db/seed.js';

describe('NextGen Manga API Suite', () => {
  let authToken: string;
  let testMangaSlug: string;
  let testChapterId: number;

  beforeAll(() => {
    // Re-seed DB to a fresh state before test suite runs
    runSeed();
  });

  describe('System & Health Checks', () => {
    it('GET /health returns healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(['healthy']).toContain(res.body.status);
      expect(['kaamsetu-api', 'nextgen-manga-api']).toContain(res.body.service);
    });

    it('GET /api/v1/health returns version and status', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
    });
  });

  describe('Authentication & User Management', () => {
    it('POST /api/v1/auth/register creates a new user account', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'TestOtaku',
          email: 'testotaku@nextgenmanga.io',
          password: 'secretPassword123',
          role: 'reader',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.username).toBe('TestOtaku');
      expect(res.body.data.token).toBeDefined();
    });

    it('POST /api/v1/auth/register rejects duplicate emails', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'AnotherUser',
          email: 'testotaku@nextgenmanga.io',
          password: 'secretPassword123',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/v1/auth/login succeeds with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          emailOrUsername: 'testotaku@nextgenmanga.io',
          password: 'secretPassword123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      authToken = res.body.data.token;
    });

    it('POST /api/v1/auth/login fails with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          emailOrUsername: 'testotaku@nextgenmanga.io',
          password: 'wrongPassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/v1/auth/me returns authenticated user profile', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.username).toBe('TestOtaku');
      expect(res.body.data.stats).toBeDefined();
    });
  });

  describe('Manga Catalog & Discovery', () => {
    it('GET /api/v1/manga returns paginated list of series', async () => {
      const res = await request(app).get('/api/v1/manga?limit=5');
      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.total).toBeGreaterThan(0);

      testMangaSlug = res.body.data.items[0].slug;
    });

    it('GET /api/v1/manga filters by genre and search term', async () => {
      const res = await request(app).get('/api/v1/manga?genre=Cyberpunk');
      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.items[0].genres).toContain('Cyberpunk');
    });

    it('GET /api/v1/manga/featured returns curated featured list', async () => {
      const res = await request(app).get('/api/v1/manga/featured');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/manga/:slug returns single manga with chapters', async () => {
      const res = await request(app).get(`/api/v1/manga/${testMangaSlug}`);
      expect(res.status).toBe(200);
      expect(res.body.data.slug).toBe(testMangaSlug);
      expect(Array.isArray(res.body.data.chapters)).toBe(true);
      if (res.body.data.chapters.length > 0) {
        testChapterId = res.body.data.chapters[0].id;
      }
    });
  });

  describe('Chapters & Cinematic Reader', () => {
    it('GET /api/v1/chapters/:id returns chapter pages and navigation links', async () => {
      if (!testChapterId) return;

      const res = await request(app)
        .get(`/api/v1/chapters/${testChapterId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(testChapterId);
      expect(Array.isArray(res.body.data.pages)).toBe(true);
      expect(res.body.data.pages.length).toBeGreaterThan(0);
    });

    it('POST and GET comments on a chapter', async () => {
      if (!testChapterId) return;

      const postRes = await request(app)
        .post(`/api/v1/chapters/${testChapterId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Phenomenal art direction!' });

      expect(postRes.status).toBe(201);
      expect(postRes.body.data.content).toBe('Phenomenal art direction!');

      const getRes = await request(app).get(`/api/v1/chapters/${testChapterId}/comments`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.data.some((c: any) => c.content === 'Phenomenal art direction!')).toBe(true);
    });
  });

  describe('Library Bookmarks & Progress', () => {
    it('POST /api/v1/bookmarks adds manga to reading list', async () => {
      const mangaRes = await request(app).get('/api/v1/manga?limit=1');
      const mangaId = mangaRes.body.data.items[0].id;

      const res = await request(app)
        .post('/api/v1/bookmarks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          manga_id: mangaId,
          status: 'reading',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const libRes = await request(app)
        .get('/api/v1/bookmarks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(libRes.status).toBe(200);
      expect(libRes.body.data.some((b: any) => b.manga_id === mangaId)).toBe(true);
    });
  });

  describe('Community Reviews & Rating Computation', () => {
    it('POST /api/v1/reviews/:mangaId submits multi-criteria review', async () => {
      const mangaRes = await request(app).get('/api/v1/manga?limit=1');
      const mangaId = mangaRes.body.data.items[0].id;

      const res = await request(app)
        .post(`/api/v1/reviews/${mangaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          rating_story: 5,
          rating_art: 5,
          rating_characters: 4,
          title: 'Unbelievable manga aesthetic',
          content: 'The pacing, shadows, and screen tone work are truly peerless.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rating_overall).toBe(4.7);
    });
  });

  describe('Platform & User Analytics', () => {
    it('GET /api/v1/stats returns platform statistics', async () => {
      const res = await request(app).get('/api/v1/stats');
      expect(res.status).toBe(200);
      expect(res.body.data.totalManga).toBeGreaterThan(0);
      expect(res.body.data.totalChapters).toBeGreaterThan(0);
      expect(Array.isArray(res.body.data.topGenres)).toBe(true);
    });

    it('GET /api/v1/stats/me returns user reading history and analytics', async () => {
      const res = await request(app)
        .get('/api/v1/stats/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.libraryBreakdown).toBeDefined();
    });
  });
});
