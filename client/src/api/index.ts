const API_BASE = '/api/v1';

export const AUTH_TOKEN_KEY = 'kaamsetu_auth_token';

export function getStoredToken(): string | null {
  return (
    localStorage.getItem('kaamsetu_auth_token') ||
    localStorage.getItem('KaamSetu_auth_token') ||
    localStorage.getItem('manga_token')
  );
}

function getAuthHeader(): Record<string, string> {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error || (data?.issues ? data.issues.map((i: any) => i.message).join(', ') : 'Request failed');
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  register: (body: any) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => apiRequest('/auth/me'),
  updateProfile: (body: any) => apiRequest('/auth/profile', { method: 'PATCH', body: JSON.stringify(body) }),

  // Manga
  getMangaList: (params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    return apiRequest(`/manga${qs ? `?${qs}` : ''}`);
  },
  getFeaturedManga: () => apiRequest('/manga/featured'),
  getMangaBySlug: (slug: string) => apiRequest(`/manga/${slug}`),
  createManga: (body: any) => apiRequest('/manga', { method: 'POST', body: JSON.stringify(body) }),
  updateManga: (id: number, body: any) => apiRequest(`/manga/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteManga: (id: number) => apiRequest(`/manga/${id}`, { method: 'DELETE' }),

  // Chapters & Reader
  getChapter: (id: number) => apiRequest(`/chapters/${id}`),
  createChapter: (body: any) => apiRequest('/chapters', { method: 'POST', body: JSON.stringify(body) }),
  getChapterComments: (id: number) => apiRequest(`/chapters/${id}/comments`),
  addChapterComment: (id: number, content: string) =>
    apiRequest(`/chapters/${id}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),

  // Bookmarks & Library
  getLibrary: (status?: string) =>
    apiRequest(`/bookmarks${status ? `?status=${status}` : ''}`),
  upsertBookmark: (mangaId: number, status: string) =>
    apiRequest('/bookmarks', { method: 'POST', body: JSON.stringify({ manga_id: mangaId, status }) }),
  removeBookmark: (mangaId: number) =>
    apiRequest(`/bookmarks/${mangaId}`, { method: 'DELETE' }),

  // Reviews
  getMangaReviews: (mangaId: number) => apiRequest(`/reviews/${mangaId}`),
  submitReview: (mangaId: number, body: any) =>
    apiRequest(`/reviews/${mangaId}`, { method: 'POST', body: JSON.stringify(body) }),
  deleteReview: (mangaId: number) =>
    apiRequest(`/reviews/${mangaId}`, { method: 'DELETE' }),
  likeReview: (reviewId: number) =>
    apiRequest(`/reviews/${reviewId}/like`, { method: 'POST' }),

  // Stats
  getPlatformStats: () => apiRequest('/stats'),
  getUserStats: () => apiRequest('/stats/me'),
};
