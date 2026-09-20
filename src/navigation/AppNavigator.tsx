import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { MainStackNavigator } from './MainStackNavigator';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { theme } = useThemeStore();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const navigationTheme = theme.mode === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={{
      ...navigationTheme,
      colors: {
        ...navigationTheme.colors,
        background: theme.colors.background,
        card: theme.colors.card,
        border: theme.colors.border,
        text: theme.colors.text,
      },
    }}>
      {isAuthenticated ? <MainStackNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
