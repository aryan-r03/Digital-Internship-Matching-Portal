import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { api, AUTH_TOKEN_KEY, getStoredToken } from '../api/index.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { emailOrUsername: string; password: string }) => Promise<void>;
  register: (data: { username: string; email: string; password: string; role?: 'candidate' | 'employer' | 'reader' | 'creator' | 'admin' }) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  quickLogin: (role: 'candidate' | 'employer' | 'admin' | 'reader' | 'creator') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function persistToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem('KaamSetu_auth_token', token);
  localStorage.setItem('manga_token', token);
}

function clearPersistedToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem('KaamSetu_auth_token');
  localStorage.removeItem('manga_token');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const currentToken = getStoredToken();
      if (!currentToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        if (res.success && res.data) {
          setUser(res.data);
          setToken(currentToken);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Failed to load authenticated user:', err);
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (credentials: { emailOrUsername: string; password: string }) => {
    const res = await api.login(credentials);
    if (res.success && res.data) {
      persistToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const register = async (data: { username: string; email: string; password: string; role?: 'candidate' | 'employer' | 'reader' | 'creator' | 'admin' }) => {
    const res = await api.register(data);
    if (res.success && res.data) {
      persistToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const logout = () => {
    clearPersistedToken();
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  const quickLogin = async (role: 'candidate' | 'employer' | 'admin' | 'reader' | 'creator') => {
    let email = 'yuki@nextgenmanga.io';
    if (role === 'employer' || role === 'creator') email = 'kenshi@nextgenmanga.io';
    if (role === 'admin') email = 'admin@nextgenmanga.io';

    await login({ emailOrUsername: email, password: 'password123' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
