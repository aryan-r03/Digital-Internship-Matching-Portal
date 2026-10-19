import { db } from '../db/index.js';
import { Internship } from '../types/index.js';

export interface InternshipFilterOptions {
  search?: string;
  category?: string;
  workMode?: string;
  roleType?: string;
  minStipend?: number;
  ppoOnly?: boolean;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'stipend' | 'deadline';
}

export class InternshipService {
  private static formatRow(row: any): Internship {
    return {
      ...row,
      is_verified: Boolean(row.is_verified),
      ppo_offered: Boolean(row.ppo_offered),
      is_mock_data: Boolean(row.is_mock_data),
      is_active: Boolean(row.is_active),
      responsibilities: JSON.parse(row.responsibilities || '[]'),
      requirements: JSON.parse(row.requirements || '[]'),
      preferred_qualifications: JSON.parse(row.preferred_qualifications || '[]'),
      perks: JSON.parse(row.perks || '[]'),
      eligible_batches: JSON.parse(row.eligible_batches || '[]'),
      eligible_degrees: JSON.parse(row.eligible_degrees || '[]'),
    };
  }

  static getById(id: number): Internship | null {
    const row = db.prepare('SELECT * FROM internships WHERE id = ?').get(id) as any;
    if (!row) return null;
    return this.formatRow(row);
  }

  static getBySlug(slug: string): Internship | null {
    const row = db.prepare('SELECT * FROM internships WHERE slug = ?').get(slug) as any;
    if (!row) return null;
    return this.formatRow(row);
  }

  static list(options: InternshipFilterOptions = {}): {
    data: Internship[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    const {
      search,
      category,
      workMode,
      roleType,
      minStipend,
      ppoOnly,
      page = 1,
      limit = 20,
      sort = 'newest',
    } = options;

    const conditions: string[] = ['is_active = 1'];
    const params: any[] = [];

    if (category && category !== 'All Domains') {
      conditions.push('category = ?');
      params.push(category);
    }

    if (workMode && workMode !== 'all') {
      conditions.push('LOWER(work_mode) = LOWER(?)');
      params.push(workMode);
    }

    if (roleType && roleType !== 'all') {
      conditions.push('role_type = ?');
      params.push(roleType);
    }

    if (minStipend && minStipend > 0) {
      conditions.push('stipend_max >= ?');
      params.push(minStipend);
    }

    if (ppoOnly) {
      conditions.push('ppo_offered = 1');
    }

    if (search && search.trim().length > 0) {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      conditions.push(`(
        LOWER(title) LIKE ? OR
        LOWER(company_name) LIKE ? OR
        LOWER(description) LIKE ? OR
        LOWER(requirements) LIKE ? OR
        LOWER(location) LIKE ?
      )`);
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Total count
    const countSql = `SELECT COUNT(*) as count FROM internships ${whereClause}`;
    const totalRow = db.prepare(countSql).get(...params) as { count: number };
    const total = totalRow ? totalRow.count : 0;

    // Sorting
    let orderBy = 'ORDER BY created_at DESC';
    if (sort === 'stipend') {
      orderBy = 'ORDER BY stipend_max DESC';
    } else if (sort === 'deadline') {
      orderBy = 'ORDER BY deadline ASC';
    }

    const offset = (Math.max(1, page) - 1) * limit;
    const selectSql = `
      SELECT * FROM internships
      ${whereClause}
      ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const rows = db.prepare(selectSql).all(...params, limit, offset) as any[];
    const data = rows.map((r) => this.formatRow(r));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }
}
