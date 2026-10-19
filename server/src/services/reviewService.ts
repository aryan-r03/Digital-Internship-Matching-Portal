import { db } from '../db/index.js';

export class ReviewService {
  static getMangaReviews(mangaId: number) {
    const rows = db.prepare(`
      SELECT r.*, u.username, u.avatar_url, u.role
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.manga_id = ?
      ORDER BY r.created_at DESC
    `).all(mangaId) as any[];

    return rows.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      manga_id: r.manga_id,
      rating_story: r.rating_story,
      rating_art: r.rating_art,
      rating_characters: r.rating_characters,
      rating_overall: r.rating_overall,
      title: r.title,
      content: r.content,
      likes_count: r.likes_count,
      created_at: r.created_at,
      updated_at: r.updated_at,
      user: {
        id: r.user_id,
        username: r.username,
        avatar_url: r.avatar_url,
        role: r.role,
      },
    }));
  }

  static upsertReview(userId: number, mangaId: number, data: {
    rating_story: number;
    rating_art: number;
    rating_characters: number;
    title: string;
    content: string;
  }) {
    const manga = db.prepare('SELECT id FROM manga WHERE id = ?').get(mangaId);
    if (!manga) {
      throw { status: 404, message: 'Manga not found.' };
    }

    const rating_overall = Number(
      ((data.rating_story + data.rating_art + data.rating_characters) / 3).toFixed(1)
    );

    const existing = db.prepare('SELECT id FROM reviews WHERE user_id = ? AND manga_id = ?').get(userId, mangaId);

    if (existing) {
      db.prepare(`
        UPDATE reviews
        SET rating_story = ?, rating_art = ?, rating_characters = ?, rating_overall = ?,
            title = ?, content = ?, updated_at = datetime('now')
        WHERE user_id = ? AND manga_id = ?
      `).run(
        data.rating_story,
        data.rating_art,
        data.rating_characters,
        rating_overall,
        data.title,
        data.content,
        userId,
        mangaId
      );
    } else {
      db.prepare(`
        INSERT INTO reviews (user_id, manga_id, rating_story, rating_art, rating_characters, rating_overall, title, content)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId,
        mangaId,
        data.rating_story,
        data.rating_art,
        data.rating_characters,
        rating_overall,
        data.title,
        data.content
      );
    }

    // Recalculate manga average rating and count
    const stats = db.prepare(`
      SELECT COUNT(*) as count, AVG(rating_overall) as avg_rating
      FROM reviews
      WHERE manga_id = ?
    `).get(mangaId) as any;

    const count = stats?.count || 0;
    const avg = stats?.avg_rating ? Number(stats.avg_rating.toFixed(1)) : 0.0;

    db.prepare('UPDATE manga SET rating_avg = ?, rating_count = ? WHERE id = ?').run(avg, count, mangaId);

    return db.prepare('SELECT * FROM reviews WHERE user_id = ? AND manga_id = ?').get(userId, mangaId);
  }

  static deleteReview(userId: number, mangaId: number) {
    db.prepare('DELETE FROM reviews WHERE user_id = ? AND manga_id = ?').run(userId, mangaId);

    const stats = db.prepare(`
      SELECT COUNT(*) as count, AVG(rating_overall) as avg_rating
      FROM reviews
      WHERE manga_id = ?
    `).get(mangaId) as any;

    const count = stats?.count || 0;
    const avg = stats?.avg_rating ? Number(stats.avg_rating.toFixed(1)) : 0.0;

    db.prepare('UPDATE manga SET rating_avg = ?, rating_count = ? WHERE id = ?').run(avg, count, mangaId);

    return { success: true };
  }

  static likeReview(reviewId: number) {
    db.prepare('UPDATE reviews SET likes_count = likes_count + 1 WHERE id = ?').run(reviewId);
    return db.prepare('SELECT likes_count FROM reviews WHERE id = ?').get(reviewId);
  }
}
