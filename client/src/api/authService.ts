const API_BASE = ((import.meta as any).env?.VITE_API_BASE as string) || 'http://localhost:5001/api/v1';
const TOKEN_KEY = 'KaamSetu_auth_token';
const USER_KEY = 'KaamSetu_auth_user';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar_url?: string;
  bio?: string;
}

export const authService = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setSession(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getUser(): AuthUser | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async register(data: { username: string; email: string; password: string }): Promise<{ token: string; user: AuthUser }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, role: 'candidate' }),
    });

    const body = await res.json();
    if (!res.ok) {
      throw new Error(body.error || 'Registration failed');
    }

    authService.setSession(body.data.token, body.data.user);
    return body.data;
  },

  async login(data: { emailOrUsername: string; password: string }): Promise<{ token: string; user: AuthUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const body = await res.json();
    if (!res.ok) {
      throw new Error(body.error || 'Login failed');
    }

    authService.setSession(body.data.token, body.data.user);
    return body.data;
  },

  async logout(): Promise<void> {
    const token = authService.getToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Ignore network errors on logout
      }
    }
    authService.clearSession();
  },

  async getMe(): Promise<any> {
    const token = authService.getToken();
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        authService.clearSession();
        return null;
      }
      const body = await res.json();
      return body.data;
    } catch {
      return null;
    }
  },
};
