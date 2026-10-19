import { db } from '../db/index.js';

export class StatsService {
  static getPlatformStats() {
    const totalManga = (db.prepare('SELECT COUNT(*) as c FROM manga').get() as any)?.c || 0;
    const totalChapters = (db.prepare('SELECT COUNT(*) as c FROM chapters').get() as any)?.c || 0;
    const totalUsers = (db.prepare('SELECT COUNT(*) as c FROM users').get() as any)?.c || 0;
    const totalViews = (db.prepare('SELECT SUM(views_count) as c FROM manga').get() as any)?.c || 0;
    const totalReviews = (db.prepare('SELECT COUNT(*) as c FROM reviews').get() as any)?.c || 0;

    // Genre distribution
    const mangaGenres = db.prepare('SELECT genres FROM manga').all() as any[];
    const genreCounts: Record<string, number> = {};
    for (const row of mangaGenres) {
      try {
        const parsed = JSON.parse(row.genres || '[]');
        for (const g of parsed) {
          genreCounts[g] = (genreCounts[g] || 0) + 1;
        }
      } catch {}
    }

    const topGenres = Object.entries(genreCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      totalManga,
      totalChapters,
      totalUsers,
      totalViews,
      totalReviews,
      topGenres,
    };
  }

  static getUserStats(userId: number) {
    const chaptersRead = (db.prepare('SELECT COUNT(*) as c FROM reading_history WHERE user_id = ?').get(userId) as any)?.c || 0;
    const bookmarks = db.prepare('SELECT status, COUNT(*) as count FROM bookmarks WHERE user_id = ? GROUP BY status').all(userId) as any[];

    const statusMap: Record<string, number> = {
      reading: 0,
      plan_to_read: 0,
      completed: 0,
      dropped: 0,
    };

    for (const b of bookmarks) {
      statusMap[b.status] = b.count;
    }

    const recentHistory = db.prepare(`
      SELECT rh.read_at, rh.progress_percent,
             c.chapter_number, c.title as chapter_title,
             m.id as manga_id, m.title as manga_title, m.slug as manga_slug, m.cover_image as manga_cover
      FROM reading_history rh
      JOIN chapters c ON c.id = rh.chapter_id
      JOIN manga m ON m.id = rh.manga_id
      WHERE rh.user_id = ?
      ORDER BY rh.read_at DESC
      LIMIT 10
    `).all(userId) as any[];

    return {
      chaptersRead,
      libraryBreakdown: statusMap,
      recentHistory,
    };
  }
}
