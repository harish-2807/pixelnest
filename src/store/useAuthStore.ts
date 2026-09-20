import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '../types/auth';
import { AVATARS } from '../types/avatar';
import { storage } from '../utils/storage';
import { useGalleryStore } from './useGalleryStore';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Omit<User, 'id'>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      clearError: () => set({ error: null }),

      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          const sessionUserId = await storage.getSession();
          if (sessionUserId) {
            const registeredUser = await storage.getRegisteredUser();
            if (registeredUser && registeredUser.id === sessionUserId) {
              set({ user: registeredUser, isAuthenticated: true, isLoading: false });
              return;
            }
          }
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const registeredUser = await storage.getRegisteredUser();
          
          if (!registeredUser) {
            set({ isLoading: false, error: 'No registered user found. Please register first.', isAuthenticated: false });
            return { success: false, error: 'No registered user found. Please register first.' };
          }

          if (registeredUser.email !== email || registeredUser.password !== password) {
            set({ isLoading: false, error: 'Invalid email or password', isAuthenticated: false });
            return { success: false, error: 'Invalid email or password' };
          }

          await storage.setSession(registeredUser.id);
          set({ user: registeredUser, isAuthenticated: true, isLoading: false, error: null });
          return { success: true };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({ isLoading: false, error: message, isAuthenticated: false });
          return { success: false, error: message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const existingUser = await storage.getRegisteredUser();
          if (existingUser) {
            set({ isLoading: false, error: 'A user is already registered. Please login.', isAuthenticated: false });
            return { success: false, error: 'A user is already registered. Please login.' };
          }

          const newUser: User = {
            ...userData,
            id: generateId(),
            avatar: userData.avatar || AVATARS[0].id,
          };

          await storage.setRegisteredUser(newUser);
          await storage.setSession(newUser.id);
          set({ user: newUser, isAuthenticated: true, isLoading: false, error: null });
          return { success: true };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Registration failed';
          set({ isLoading: false, error: message, isAuthenticated: false });
          return { success: false, error: message };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await storage.clearSession();
          useGalleryStore.getState().resetGallery();
          set({ user: null, isAuthenticated: false, isLoading: false, error: null });
        } catch {
          set({ isLoading: false });
        }
      },

      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });
        try {
          const updatedUser = { ...user, ...updates };
          await storage.setRegisteredUser(updatedUser);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update profile';
          set({ isLoading: false, error: message });
          throw error;
        }
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);