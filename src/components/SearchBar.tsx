import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search by author...',
  style,
  inputStyle,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[
      styles.container,
      { backgroundColor: colors.surface, borderColor: colors.border },
      style,
    ]}>
      <TextInput
        style={[styles.input, { color: colors.text }, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        clearButtonMode="while-editing"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
