//Hold accessToken and authentication status. single source of truth

import { create } from "zustand";

export const useAuthStore = create((set) => ({
  accessToken: null,
  isAuthenticated: false,
  setToken: (token) => set({ accessToken: token, isAuthenticated: true }),
  logout: () => set({ accessToken: null, isAuthenticated: false }),
}));
