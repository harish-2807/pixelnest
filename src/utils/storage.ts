import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth';

const STORAGE_KEYS = {
  REGISTERED_USER: '@fotoowl_registered_user',
  SESSION: '@fotoowl_session',
  FAVORITES: '@fotoowl_favorites',
} as const;

export const storage = {
  async getRegisteredUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async setRegisteredUser(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USER, JSON.stringify(user));
  },

  async getSession(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
    } catch {
      return null;
    }
  },

  async setSession(userId: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION, userId);
  },

  async clearSession(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  async getFavorites(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async setFavorites(favorites: string[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  },
};
