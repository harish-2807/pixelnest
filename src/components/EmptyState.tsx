import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
  iconStyle?: ImageStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  style,
  titleStyle,
  messageStyle,
  iconStyle,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {icon && <Image source={{ uri: icon }} style={[styles.icon, iconStyle]} />}
      <Text style={[
        styles.title,
        { color: colors.text },
        titleStyle,
      ]}>{title}</Text>
      {message && <Text style={[
        styles.message,
        { color: colors.textSecondary },
        messageStyle,
      ]}>{message}</Text>}
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
  icon: {
    width: 80,
    height: 80,
    marginBottom: 16,
    opacity: 0.6,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
