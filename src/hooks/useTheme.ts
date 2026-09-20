import { useThemeStore } from '../store/useThemeStore';
import { Theme } from '../types/theme';

export const useTheme = (): Theme => {
  return useThemeStore((state) => state.theme);
};
