import { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(storage.getToken());
  const [user, setUser] = useState<User | null>(storage.getUser());

  const login = async (payload: LoginRequest) => {
    const data: AuthResponse = await authService.login(payload);
    storage.setToken(data.token);
    storage.setUser(data.user);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (payload: RegisterRequest) => {
    await authService.register(payload);
  };

  const logout = () => {
    storage.clearToken();
    storage.clearUser();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: !!token, login, register, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}