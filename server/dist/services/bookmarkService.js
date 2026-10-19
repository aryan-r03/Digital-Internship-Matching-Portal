import { db } from '../db/index.js';
export class BookmarkService {
    static getUserLibrary(userId, status) {
        let whereSQL = 'WHERE b.user_id = ?';
        const params = [userId];
        if (status && status !== 'all') {
            whereSQL += ' AND b.status = ?';
            params.push(status);
        }
        const rows = db.prepare(`
      SELECT b.*,
        m.title as manga_title,
        m.japanese_title as manga_japanese_title,
        m.slug as manga_slug,
        m.cover_image as manga_cover_image,
        m.status as manga_status,
        m.rating_avg as manga_rating_avg,
        c.chapter_number as last_read_chapter_number,
        c.title as last_read_chapter_title,
        (SELECT MAX(chapter_number) FROM chapters WHERE manga_id = m.id) as total_chapters
      FROM bookmarks b
      JOIN manga m ON m.id = b.manga_id
      LEFT JOIN chapters c ON c.id = b.last_read_chapter_id
      ${whereSQL}
      ORDER BY b.updated_at DESC
    `).all(...params);
        return rows.map((r) => ({
            id: r.id,
            user_id: r.user_id,
            manga_id: r.manga_id,
            status: r.status,
            last_read_chapter_id: r.last_read_chapter_id,
            last_read_page: r.last_read_page,
            created_at: r.created_at,
            updated_at: r.updated_at,
            manga: {
                id: r.manga_id,
                title: r.manga_title,
                japanese_title: r.manga_japanese_title,
                slug: r.manga_slug,
                cover_image: r.manga_cover_image,
                status: r.manga_status,
                rating_avg: r.manga_rating_avg,
                latest_chapter: r.total_chapters,
            },
            last_read_chapter: r.last_read_chapter_id ? {
                id: r.last_read_chapter_id,
                chapter_number: r.last_read_chapter_number,
                title: r.last_read_chapter_title,
            } : null,
        }));
    }
    static upsertBookmark(userId, mangaId, status) {
        const manga = db.prepare('SELECT id FROM manga WHERE id = ?').get(mangaId);
        if (!manga) {
            throw { status: 404, message: 'Manga not found.' };
        }
        const existing = db.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND manga_id = ?').get(userId, mangaId);
        if (existing) {
            db.prepare(`
        UPDATE bookmarks
        SET status = ?, updated_at = datetime('now')
        WHERE user_id = ? AND manga_id = ?
      `).run(status, userId, mangaId);
        }
        else {
            db.prepare(`
        INSERT INTO bookmarks (user_id, manga_id, status)
        VALUES (?, ?, ?)
      `).run(userId, mangaId, status);
            // Increment manga bookmarks_count
            db.prepare('UPDATE manga SET bookmarks_count = bookmarks_count + 1 WHERE id = ?').run(mangaId);
        }
        return db.prepare('SELECT * FROM bookmarks WHERE user_id = ? AND manga_id = ?').get(userId, mangaId);
    }
    static removeBookmark(userId, mangaId) {
        const existing = db.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND manga_id = ?').get(userId, mangaId);
        if (!existing) {
            return { success: true };
        }
        db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND manga_id = ?').run(userId, mangaId);
        db.prepare('UPDATE manga SET bookmarks_count = MAX(0, bookmarks_count - 1) WHERE id = ?').run(mangaId);
        return { success: true };
    }
}
