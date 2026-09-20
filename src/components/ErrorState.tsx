import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { AppButton } from './AppButton';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  style?: ViewStyle;
  messageStyle?: TextStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  retryLabel = 'Retry',
  style,
  messageStyle,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text style={[
        styles.message,
        { color: colors.danger },
        messageStyle,
      ]}>{message}</Text>
      {onRetry && (
        <AppButton
          title={retryLabel}
          onPress={onRetry}
          variant="outline"
          fullWidth={false}
          style={styles.retryButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
});
