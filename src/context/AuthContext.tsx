import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { JwtTokenManager } from '../infrastructure/token/JwtTokenManager';
import { refreshAccessToken } from '../services/authService';
import socketService from '../services/socketService';
import { getCurrentUser } from '../services/userService';
import type { UserMeDto } from '../types';

interface AuthState {
  user: UserMeDto | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserMeDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokenManager = useMemo(() => new JwtTokenManager(), []);

  // Kullanıcı bilgilerini API'den al
  const refreshUser = async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await getCurrentUser();
      setUser(response.user);
    } catch (error: unknown) {
      console.error('Kullanıcı bilgileri alınırken hata:', error);
      
      // 401 hatası ise refresh token ile yenilemeyi dene
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'status' in error.response && 
          error.response.status === 401) {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            const response = await getCurrentUser();
            setUser(response.user);
            return;
          }
        } catch (refreshError) {
          console.error('Refresh token ile yenileme başarısız:', refreshError);
        }
      }
      
      // Refresh başarısızsa veya başka hata varsa kullanıcıyı çıkış yap
      setUser(null);
      tokenManager.destroyToken();
      tokenManager.destroyRefreshToken();
    } finally {
      setIsLoading(false);
    }
  };

  // Component mount olduğunda kullanıcı bilgilerini al
  useEffect(() => {
    refreshUser();
  }, []);

  // Token değiştiğinde kullanıcı bilgilerini yenile
  useEffect(() => {
    const token = tokenManager.getToken();
    if (token && !user) {
      refreshUser();
    } else if (!token && user) {
      setUser(null);
    }
  }, [tokenManager.getToken()]);

  const logout = () => {
    setUser(null);
    tokenManager.destroyToken();
    tokenManager.destroyRefreshToken();
    // Socket bağlantısını kes
    socketService.disconnect();
  };

  const value: AuthState = {
    user,
    isAdmin: (user?.role ?? '').toLowerCase() === 'admin',
    isAuthenticated: !!tokenManager.getToken() && !!user,
    isLoading,
    refreshUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


