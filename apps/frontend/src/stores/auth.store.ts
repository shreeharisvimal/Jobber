import { create } from "zustand";
import type { User, TokenResponse } from "@/types/auth";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setTokens: (tokens: TokenResponse) => void;
  login: (user: User, tokens: TokenResponse) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;

  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

function getStoredTokens() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  return { accessToken, refreshToken };
}

function clearStoredTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function persistTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

const { accessToken: initialAccessToken } = getStoredTokens();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: !!initialAccessToken,
  isLoading: !!initialAccessToken,

  setUser: (user) => set({ user }),

  setTokens: (tokens) => {
    persistTokens(tokens.access_token, tokens.refresh_token);
  },

  login: (user, tokens) => {
    persistTokens(tokens.access_token, tokens.refresh_token);
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    clearStoredTokens();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  getAccessToken: () => {
    return get().isAuthenticated
      ? localStorage.getItem(ACCESS_TOKEN_KEY)
      : null;
  },

  getRefreshToken: () => {
    return get().isAuthenticated
      ? localStorage.getItem(REFRESH_TOKEN_KEY)
      : null;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasPermission: (_permission: string) => {
    const user = get().user;
    if (!user) return false;
    return user.role === "admin" || user.role === "superadmin";
  },

  hasRole: (role: string) => {
    const user = get().user;
    if (!user) return false;
    return user.role === role;
  },
}));
