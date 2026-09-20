import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeMode, lightTheme, darkTheme } from '../types/theme';
import { themeStorage } from '../utils/themeStorage';
import { AVATARS } from '../types/avatar';

interface ThemeState {
  theme: Theme;
  avatar: string;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setAvatar: (avatar: string) => void;
  initializeTheme: () => Promise<void>;
  initializeAvatar: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: lightTheme,
      avatar: AVATARS[0].id,

      initializeTheme: async () => {
        const mode = await themeStorage.getTheme();
        set({ theme: mode === 'dark' ? darkTheme : lightTheme });
      },

      initializeAvatar: async () => {
        const storedAvatar = await themeStorage.getAvatar();
        if (storedAvatar) {
          set({ avatar: storedAvatar });
        } else {
          set({ avatar: AVATARS[0].id });
        }
      },

      setThemeMode: (mode: ThemeMode) => {
        const theme = mode === 'dark' ? darkTheme : lightTheme;
        set({ theme });
        themeStorage.setTheme(mode);
      },

      toggleTheme: () => {
        const currentMode = get().theme.mode;
        const newMode: ThemeMode = currentMode === 'light' ? 'dark' : 'light';
        const theme = newMode === 'dark' ? darkTheme : lightTheme;
        set({ theme });
        themeStorage.setTheme(newMode);
      },

      setAvatar: (avatar: string) => {
        set({ avatar });
        themeStorage.setAvatar(avatar);
      },
    }),
    {
      name: 'theme-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);
