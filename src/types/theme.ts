export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderLight: string;
  primary: string;
  danger: string;
  warning: string;
  success: string;
  shadow: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
}

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: '#F2F2F7',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#1C1C1E',
    textSecondary: '#8E8E93',
    textTertiary: '#C6C6C8',
    border: '#E5E5EA',
    borderLight: '#EFEFF0',
    primary: '#007AFF',
    danger: '#FF3B30',
    warning: '#FF9500',
    success: '#30B05F',
    shadow: '#000000',
  },
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    card: '#252526',
    text: '#E5E5E5',
    textSecondary: '#9DA0A4',
    textTertiary: '#5A5A5E',
    border: '#3A3A3C',
    borderLight: '#4A4A4D',
    primary: '#0A84FF',
    danger: '#FF4740',
    warning: '#FF9F0A',
    success: '#31C789',
    shadow: '#000000',
  },
};

export const THEME_STORAGE_KEY = '@fotoowl_theme';
export const AVATAR_STORAGE_KEY = '@fotoowl_avatar';
