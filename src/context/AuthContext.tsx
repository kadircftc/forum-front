import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { JwtTokenManager } from '../infrastructure/token/JwtTokenManager';
import type { AuthUserDto } from '../types';

interface AuthState {
  user: AuthUserDto | null;
  setUser: (u: AuthUserDto | null) => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const USER_KEY = 'authUser';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUserDto | null>(null);
  const tokenManager = useMemo(() => new JwtTokenManager(), []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  const logout = () => {
    setUser(null);
    tokenManager.destroyToken();
    tokenManager.destroyRefreshToken();
  };

  const value: AuthState = {
    user,
    setUser,
    isAdmin: (user?.role ?? '').toLowerCase() === 'admin',
    isAuthenticated: !!tokenManager.getToken(),
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


