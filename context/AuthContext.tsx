import { API_BASE_URL } from '@/constants/api';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { createContext, useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

export type User = {
  id?: string | number;
  name?: string;
  email?: string;
  username?: string;
  role?: string;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  authLoading: boolean;
  login: (accessToken: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'auth_token';

const secureSet = async (k: string, v: string) => {
  if (Platform.OS !== 'web') await SecureStore.setItemAsync(k, v);
  else localStorage.setItem(k, v);
};
const secureGet = async (k: string): Promise<string | null> => {
  if (Platform.OS !== 'web') return SecureStore.getItemAsync(k);
  return localStorage.getItem(k);
};
const secureDelete = async (k: string) => {
  if (Platform.OS !== 'web') await SecureStore.deleteItemAsync(k);
  else localStorage.removeItem(k);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (accessToken: string, userData: User) => {
    try {
      await secureSet(TOKEN_KEY, accessToken);
      setToken(accessToken);
      setUser(userData);
    } catch (e) {
      console.error('Failed to save token:', e);
      throw e;
    }
  };

  const logout = async () => {
    try { await secureDelete(TOKEN_KEY); } catch (e) { console.error(e); }
    setToken(null);
    setUser(null);
    router.replace('/sign-in');
  };

  const restoreSession = async () => {
    setAuthLoading(true);
    try {
      const saved = await secureGet(TOKEN_KEY);
      if (!saved) return;
      const res = await fetch(`${API_BASE_URL}/users/1`, {
        headers: { Authorization: `Bearer ${saved}` },
      });
      if (!res.ok) {
        if (res.status === 401) await secureDelete(TOKEN_KEY);
        return;
      }
      const data = await res.json();
      setToken(saved);
      setUser({ id: data.id, name: data.name, email: data.email, username: data.username });
    } catch (e) {
      console.error('Session restore failed:', e);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => { restoreSession(); }, []);

  return (
    <AuthContext.Provider value={{ token, user, authLoading, login, logout, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
}