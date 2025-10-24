'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  role: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const storedToken = localStorage.getItem('adminToken');
    const storedUser = localStorage.getItem('adminUser');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Also set cookie for middleware
      document.cookie = `adminToken=${storedToken}; path=/; max-age=3600; SameSite=Lax`;
    }
    setIsLoading(false);
  };

  const login = async (username: string, password: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Invalid credentials');
    }

    const data = await response.json();

    // Store session (VULNERABILITY: localStorage is XSS vulnerable)
    localStorage.setItem('adminToken', data.token);
    const userData = {
      username: data.username,
      role: data.role,
      email: `${data.username}@dvtc.local`
    };
    localStorage.setItem('adminUser', JSON.stringify(userData));

    // Also set cookie for middleware
    document.cookie = `adminToken=${data.token}; path=/; max-age=3600; SameSite=Lax`;

    setToken(data.token);
    setUser(userData);
    setIsLoading(false);

    router.push('/admin/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    // Clear cookie
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setToken(null);
    setUser(null);
    router.push('/');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}