import React from 'react';
import { TextInput, View, Text, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface AppInputProps extends Omit<TextInputProps, 'onChangeText' | 'value'> {
  label?: string;
  error?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  containerStyle,
  ...rest
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors.text }, labelStyle]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          {
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: colors.surface,
          },
          inputStyle,
          error && { borderColor: colors.danger },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={secureTextEntry}
        {...rest}
      />
      {error && <Text style={[styles.errorText, { color: colors.danger }, errorStyle]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
