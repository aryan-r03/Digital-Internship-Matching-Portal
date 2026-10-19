import { db } from '../db/index.js';
import { Manga, Chapter } from '../types/index.js';

export interface MangaFilterOptions {
  search?: string;
  genre?: string;
  demographic?: string;
  status?: string;
  sort?: 'trending' | 'top_rated' | 'newest' | 'alphabetical';
  limit?: number;
  offset?: number;
}

export class MangaService {
  static list(options: MangaFilterOptions) {
    const {
      search,
      genre,
      demographic,
      status,
      sort = 'trending',
      limit = 20,
      offset = 0,
    } = options;

    let whereClauses: string[] = [];
    let params: any[] = [];

    if (search && search.trim() !== '') {
      whereClauses.push('(title LIKE ? OR japanese_title LIKE ? OR synopsis LIKE ? OR author LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    if (genre && genre !== 'All') {
      whereClauses.push('genres LIKE ?');
      params.push(`%"${genre}"%`);
    }

    if (demographic && demographic !== 'All') {
      whereClauses.push('demographic = ?');
      params.push(demographic);
    }

    if (status && status !== 'All') {
      whereClauses.push('status = ?');
      params.push(status);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    let orderSQL = 'ORDER BY views_count DESC';
    if (sort === 'top_rated') {
      orderSQL = 'ORDER BY rating_avg DESC, rating_count DESC';
    } else if (sort === 'newest') {
      orderSQL = 'ORDER BY created_at DESC';
    } else if (sort === 'alphabetical') {
      orderSQL = 'ORDER BY title ASC';
    }

    // Get total count for pagination
    const countRow = db.prepare(`SELECT COUNT(*) as total FROM manga ${whereSQL}`).get(...params) as any;
    const total = countRow ? countRow.total : 0;

    // Fetch records
    const rows = db.prepare(`
      SELECT m.*, 
        (SELECT COUNT(*) FROM chapters WHERE manga_id = m.id) as chapters_count,
        (SELECT MAX(chapter_number) FROM chapters WHERE manga_id = m.id) as latest_chapter
      FROM manga m
      ${whereSQL}
      ${orderSQL}
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset) as any[];

    const items: Manga[] = rows.map((r) => ({
      ...r,
      genres: JSON.parse(r.genres || '[]'),
    }));

    return {
      items,
      total,
      limit,
      offset,
      hasMore: offset + items.length < total,
    };
  }

  static getFeatured() {
    const rows = db.prepare(`
      SELECT m.*, 
        (SELECT COUNT(*) FROM chapters WHERE manga_id = m.id) as chapters_count,
        (SELECT MAX(chapter_number) FROM chapters WHERE manga_id = m.id) as latest_chapter
      FROM manga m
      WHERE is_featured = 1
      ORDER BY views_count DESC
      LIMIT 6
    `).all() as any[];

    return rows.map((r) => ({
      ...r,
      genres: JSON.parse(r.genres || '[]'),
    }));
  }

  static getBySlug(slug: string, currentUserId?: number) {
    const manga = db.prepare(`
      SELECT m.*,
        (SELECT COUNT(*) FROM chapters WHERE manga_id = m.id) as chapters_count,
        (SELECT MAX(chapter_number) FROM chapters WHERE manga_id = m.id) as latest_chapter
      FROM manga m
      WHERE slug = ?
    `).get(slug) as any;

    if (!manga) {
      throw { status: 404, message: 'Manga series not found.' };
    }

    // Increment views
    db.prepare('UPDATE manga SET views_count = views_count + 1 WHERE id = ?').run(manga.id);

    // Fetch chapters
    const chapters = db.prepare(`
      SELECT id, manga_id, chapter_number, title, release_date, views_count, created_at
      FROM chapters
      WHERE manga_id = ?
      ORDER BY chapter_number ASC
    `).all(manga.id) as unknown as Chapter[];

    // Fetch user bookmark if logged in
    let userBookmark = null;
    if (currentUserId) {
      userBookmark = db.prepare(`
        SELECT * FROM bookmarks WHERE user_id = ? AND manga_id = ?
      `).get(currentUserId, manga.id);
    }

    return {
      ...manga,
      genres: JSON.parse(manga.genres || '[]'),
      chapters,
      userBookmark,
    };
  }

  static create(data: {
    title: string;
    japanese_title?: string;
    synopsis: string;
    cover_image: string;
    banner_image?: string;
    author: string;
    artist: string;
    status: 'Ongoing' | 'Completed' | 'Hiatus';
    demographic: 'Shonen' | 'Seinen' | 'Shojo' | 'Josei';
    release_year: number;
    genres: string[];
    is_featured?: boolean;
    creator_id?: number;
  }) {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6);

    const result = db.prepare(`
      INSERT INTO manga (
        title, japanese_title, slug, synopsis, cover_image, banner_image,
        author, artist, status, demographic, release_year, genres, is_featured, creator_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.title,
      data.japanese_title || null,
      slug,
      data.synopsis,
      data.cover_image,
      data.banner_image || null,
      data.author,
      data.artist,
      data.status || 'Ongoing',
      data.demographic || 'Shonen',
      data.release_year || new Date().getFullYear(),
      JSON.stringify(data.genres || []),
      data.is_featured ? 1 : 0,
      data.creator_id || null
    );

    return this.getBySlug(slug);
  }

  static update(id: number, data: Partial<Manga>, userId: number, userRole: string) {
    const existing = db.prepare('SELECT creator_id FROM manga WHERE id = ?').get(id) as any;
    if (!existing) {
      throw { status: 404, message: 'Manga not found.' };
    }

    if (userRole !== 'admin' && existing.creator_id !== userId) {
      throw { status: 403, message: 'You do not have permission to modify this manga.' };
    }

    const updates: string[] = [];
    const params: any[] = [];

    const allowedFields = [
      'title', 'japanese_title', 'synopsis', 'cover_image', 'banner_image',
      'author', 'artist', 'status', 'demographic', 'release_year'
    ];

    for (const field of allowedFields) {
      if ((data as any)[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push((data as any)[field]);
      }
    }

    if (data.genres !== undefined) {
      updates.push('genres = ?');
      params.push(JSON.stringify(data.genres));
    }

    if (data.is_featured !== undefined && userRole === 'admin') {
      updates.push('is_featured = ?');
      params.push(data.is_featured ? 1 : 0);
    }

    if (updates.length > 0) {
      updates.push("updated_at = datetime('now')");
      params.push(id);
      db.prepare(`UPDATE manga SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    const updated = db.prepare('SELECT slug FROM manga WHERE id = ?').get(id) as any;
    return this.getBySlug(updated.slug);
  }

  static delete(id: number, userId: number, userRole: string) {
    const existing = db.prepare('SELECT creator_id FROM manga WHERE id = ?').get(id) as any;
    if (!existing) {
      throw { status: 404, message: 'Manga not found.' };
    }

    if (userRole !== 'admin' && existing.creator_id !== userId) {
      throw { status: 403, message: 'You do not have permission to delete this manga.' };
    }

    db.prepare('DELETE FROM manga WHERE id = ?').run(id);
    return { success: true, message: 'Manga deleted successfully.' };
  }
}
