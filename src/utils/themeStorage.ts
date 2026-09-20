import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, THEME_STORAGE_KEY, AVATAR_STORAGE_KEY } from '../types/theme';

export const themeStorage = {
  async getTheme(): Promise<ThemeMode> {
    try {
      const data = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      return data === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  },

  async setTheme(theme: ThemeMode): Promise<void> {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
  },

  async getAvatar(): Promise<string | null> {
    try {
      const data = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
      return data;
    } catch {
      return null;
    }
  },

  async setAvatar(avatar: string): Promise<void> {
    await AsyncStorage.setItem(AVATAR_STORAGE_KEY, avatar);
  },
};
