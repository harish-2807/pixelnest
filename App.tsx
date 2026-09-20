import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAuthStore } from './src/store/useAuthStore';
import { useThemeStore } from './src/store/useThemeStore';

export default function App() {
  const { initializeAuth } = useAuthStore();
  const { initializeTheme, initializeAvatar, theme } = useThemeStore();

  React.useEffect(() => {
    initializeAuth();
    initializeTheme();
    initializeAvatar();
  }, [initializeAuth, initializeTheme, initializeAvatar]);

  return (
    <>
      <AppNavigator />
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
    </>
  );
}
