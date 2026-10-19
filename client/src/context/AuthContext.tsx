import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { api } from '../api/index.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { emailOrUsername: string; password: string }) => Promise<void>;
  register: (data: { username: string; email: string; password: string; role?: 'reader' | 'creator' }) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  quickLogin: (role: 'reader' | 'creator' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('manga_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        if (res.success && res.data) {
          setUser(res.data);
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
  }, [token]);

  const login = async (credentials: { emailOrUsername: string; password: string }) => {
    const res = await api.login(credentials);
    if (res.success && res.data) {
      localStorage.setItem('manga_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const register = async (data: { username: string; email: string; password: string; role?: 'reader' | 'creator' }) => {
    const res = await api.register(data);
    if (res.success && res.data) {
      localStorage.setItem('manga_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('manga_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  const quickLogin = async (role: 'reader' | 'creator' | 'admin') => {
    let email = 'yuki@nextgenmanga.io';
    if (role === 'creator') email = 'kenshi@nextgenmanga.io';
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
