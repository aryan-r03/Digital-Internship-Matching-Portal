import { db } from '../db/index.js';
export class ChapterService {
    static getById(id, currentUserId) {
        const chapter = db.prepare(`
      SELECT c.*, m.title as manga_title, m.slug as manga_slug, m.cover_image as manga_cover
      FROM chapters c
      JOIN manga m ON m.id = c.manga_id
      WHERE c.id = ?
    `).get(id);
        if (!chapter) {
            throw { status: 404, message: 'Chapter not found.' };
        }
        // Increment views
        db.prepare('UPDATE chapters SET views_count = views_count + 1 WHERE id = ?').run(id);
        // Find previous and next chapters for seamless reader navigation
        const prevChapter = db.prepare(`
      SELECT id, chapter_number, title
      FROM chapters
      WHERE manga_id = ? AND chapter_number < ?
      ORDER BY chapter_number DESC
      LIMIT 1
    `).get(chapter.manga_id, chapter.chapter_number);
        const nextChapter = db.prepare(`
      SELECT id, chapter_number, title
      FROM chapters
      WHERE manga_id = ? AND chapter_number > ?
      ORDER BY chapter_number ASC
      LIMIT 1
    `).get(chapter.manga_id, chapter.chapter_number);
        // Record reading history & bookmark if user is logged in
        if (currentUserId) {
            try {
                db.prepare(`
          INSERT INTO reading_history (user_id, chapter_id, manga_id, progress_percent, read_at)
          VALUES (?, ?, ?, 100, datetime('now'))
          ON CONFLICT(user_id, chapter_id) DO UPDATE SET
            progress_percent = 100,
            read_at = datetime('now')
        `).run(currentUserId, id, chapter.manga_id);
                // Also update bookmark last_read_chapter_id if a bookmark exists
                db.prepare(`
          UPDATE bookmarks
          SET last_read_chapter_id = ?, updated_at = datetime('now')
          WHERE user_id = ? AND manga_id = ?
        `).run(id, currentUserId, chapter.manga_id);
            }
            catch (err) {
                console.error('Error recording reading history:', err);
            }
        }
        return {
            id: chapter.id,
            manga_id: chapter.manga_id,
            manga_title: chapter.manga_title,
            manga_slug: chapter.manga_slug,
            manga_cover: chapter.manga_cover,
            chapter_number: chapter.chapter_number,
            title: chapter.title,
            release_date: chapter.release_date,
            views_count: chapter.views_count,
            pages: JSON.parse(chapter.pages || '[]'),
            prevChapter: prevChapter || null,
            nextChapter: nextChapter || null,
        };
    }
    static create(mangaId, data, userId, userRole) {
        const manga = db.prepare('SELECT creator_id FROM manga WHERE id = ?').get(mangaId);
        if (!manga) {
            throw { status: 404, message: 'Manga not found.' };
        }
        if (userRole !== 'admin' && manga.creator_id !== userId) {
            throw { status: 403, message: 'You do not have permission to add chapters to this manga.' };
        }
        const result = db.prepare(`
      INSERT INTO chapters (manga_id, chapter_number, title, pages)
      VALUES (?, ?, ?, ?)
    `).run(mangaId, data.chapter_number, data.title, JSON.stringify(data.pages || []));
        const chapterId = Number(result.lastInsertRowid);
        return this.getById(chapterId, userId);
    }
    static getComments(chapterId) {
        const rows = db.prepare(`
      SELECT cc.id, cc.chapter_id, cc.user_id, cc.content, cc.created_at,
             u.username, u.avatar_url, u.role
      FROM chapter_comments cc
      JOIN users u ON u.id = cc.user_id
      WHERE cc.chapter_id = ?
      ORDER BY cc.created_at DESC
    `).all(chapterId);
        return rows.map((r) => ({
            id: r.id,
            chapter_id: r.chapter_id,
            content: r.content,
            created_at: r.created_at,
            user: {
                id: r.user_id,
                username: r.username,
                avatar_url: r.avatar_url,
                role: r.role,
            },
        }));
    }
    static addComment(chapterId, userId, content) {
        const chapter = db.prepare('SELECT id FROM chapters WHERE id = ?').get(chapterId);
        if (!chapter) {
            throw { status: 404, message: 'Chapter not found.' };
        }
        const result = db.prepare(`
      INSERT INTO chapter_comments (chapter_id, user_id, content)
      VALUES (?, ?, ?)
    `).run(chapterId, userId, content);
        const commentId = Number(result.lastInsertRowid);
        const comment = db.prepare(`
      SELECT cc.id, cc.chapter_id, cc.user_id, cc.content, cc.created_at,
             u.username, u.avatar_url, u.role
      FROM chapter_comments cc
      JOIN users u ON u.id = cc.user_id
      WHERE cc.id = ?
    `).get(commentId);
        return {
            id: comment.id,
            chapter_id: comment.chapter_id,
            content: comment.content,
            created_at: comment.created_at,
            user: {
                id: comment.user_id,
                username: comment.username,
                avatar_url: comment.avatar_url,
                role: comment.role,
            },
        };
    }
}
