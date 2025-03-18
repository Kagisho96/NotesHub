import authService from "../services/auth";
import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const user = await authService.login({ email, password });
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to login',
        isLoading: false,
        isAuthenticated: false 
      });
    }
  },
  
  register: async (name: string, email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const user = await authService.register({ name, email, password });
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to register',
        isLoading: false,
        isAuthenticated: false 
      });
    }
  },
  
  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
  
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      if (authService.isAuthenticated()) {
        const user = await authService.getCurrentUser();
        if (user) {
          set({ user, isAuthenticated: true });
        } else {
          authService.logout();
          set({ user: null, isAuthenticated: false });
        }
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
  
  clearError: () => set({ error: null })
}));

export default useAuthStore; 