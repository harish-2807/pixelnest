import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useTheme } from '../../hooks/useTheme';
import { AppInput } from '../../components/AppInput';
import { AppButton } from '../../components/AppButton';
import { validateLoginForm } from '../../utils/validation';
import { LoginFormData, ValidationErrors } from '../../types/auth';
import { AuthStackScreenProps } from '../../types/navigation';

export const LoginScreen: React.FC<AuthStackScreenProps<'Login'>> = ({ navigation }) => {
  const { login, error: authError, clearError, isLoading } = useAuthStore();
  const { colors } = useTheme();
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    clearError();
    await login(formData.email, formData.password);
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.brand, { color: colors.primary }]}>PixelNest</Text>
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign in to your account
            </Text>
          </View>

          <View style={styles.form}>
            <AppInput
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              accessibilityLabel="Email address"
            />

            <AppInput
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              error={errors.password}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              accessibilityLabel="Password"
            />

            {authError && (
              <View
                style={[
                  styles.authError,
                  { backgroundColor: darkErrorBg(colors), borderColor: colors.danger },
                ]}
              >
                <Text style={[styles.authErrorText, { color: colors.danger }]}>
                  {authError}
                </Text>
              </View>
            )}

            <AppButton
              title="Sign In"
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
              accessibilityLabel="Sign in button"
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleRegisterPress} accessibilityRole="link">
              <Text style={[styles.link, { color: colors.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const darkErrorBg = (colors: { danger: string }) =>
  colors.danger + '1A';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brand: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  authError: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  authErrorText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 15,
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
  },
});
