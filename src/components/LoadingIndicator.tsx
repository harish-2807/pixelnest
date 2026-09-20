import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Loading...',
  size = 'large',
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && <Text style={[styles.message, { color: colors.textSecondary }, textStyle]}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
  },
});
