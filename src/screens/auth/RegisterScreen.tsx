import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useTheme } from '../../hooks/useTheme';
import { AppInput } from '../../components/AppInput';
import { AppButton } from '../../components/AppButton';
import { validateRegisterForm } from '../../utils/validation';
import { RegisterFormData, ValidationErrors, CITIES, City } from '../../types/auth';
import { AuthStackScreenProps } from '../../types/navigation';

export const RegisterScreen: React.FC<AuthStackScreenProps<'Register'>> = ({ navigation }) => {
  const { register, error: authError, clearError, isLoading } = useAuthStore();
  const { colors } = useTheme();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    gender: 'male',
    mobile: '',
    address: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showCityModal, setShowCityModal] = useState(false);

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleGenderChange = (gender: 'male' | 'female' | 'other') => {
    handleChange('gender', gender);
  };

  const handleCityChange = (city: City) => {
    handleChange('city', city);
    setShowCityModal(false);
  };

  const handleSubmit = async () => {
    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    clearError();
    const result = await register({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      gender: formData.gender,
      mobile: formData.mobile.trim(),
      address: formData.address.trim(),
      city: formData.city,
      password: formData.password,
    });
    
    if (result.success) {
      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please login.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
      );
    } else if (result.error) {
      Alert.alert('Registration Failed', result.error);
    }
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
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
            <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Fill in your details to register
            </Text>
          </View>

        <View style={styles.form}>
          <AppInput
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={(text) => handleChange('fullName', text)}
            error={errors.fullName}
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
          />

          <AppInput
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            error={errors.email}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
          />

          <View style={styles.sectionLabel}>
            <Text style={[styles.label, { color: colors.text }]}>Gender</Text>
          </View>
          <View style={styles.radioGroup}>
            {(['male', 'female', 'other'] as const).map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.radioOption,
                  formData.gender === gender && [styles.radioOptionSelected, { borderColor: colors.primary, backgroundColor: colors.surface }],
                ]}
                onPress={() => handleGenderChange(gender)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.gender === gender && { backgroundColor: colors.primary },
                  ]}
                />
                <Text style={[
                  styles.radioLabel,
                  { color: colors.text },
                  formData.gender === gender && { color: colors.primary },
                ]}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <AppInput
            label="Mobile Number"
            placeholder="Enter 10-digit mobile number"
            value={formData.mobile}
            onChangeText={(text) => handleChange('mobile', text.replace(/\D/g, '').slice(0, 10))}
            error={errors.mobile}
            keyboardType="numeric"
            autoComplete="tel"
            textContentType="telephoneNumber"
            maxLength={10}
          />

          <AppInput
            label="Address"
            placeholder="Enter your address"
            value={formData.address}
            onChangeText={(text) => handleChange('address', text)}
            error={errors.address}
            autoCapitalize="words"
            autoComplete="street-address"
            textContentType="streetAddressLine1"
          />

          <View style={styles.sectionLabel}>
            <Text style={[styles.label, { color: colors.text }]}>City</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.cityButton,
              errors.city && { borderColor: colors.danger },
              {
                borderColor: errors.city ? colors.danger : colors.border,
                backgroundColor: colors.surface,
              },
            ]}
            onPress={() => setShowCityModal(true)}
          >
            <Text style={[
              styles.cityButtonText,
              formData.city ? { color: colors.text } : { color: colors.textSecondary },
            ]}>
              {formData.city || 'Select City'}
            </Text>
          </TouchableOpacity>

          <AppInput
            label="Password"
            placeholder="Enter password (min 6 characters)"
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
            error={errors.password}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
          />

          <AppInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            error={errors.confirmPassword}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
          />

          {authError && (
            <View style={[styles.authError, { borderColor: colors.danger }]}>
              <Text style={[styles.authErrorText, { color: colors.danger }]}>{authError}</Text>
            </View>
          )}

          <AppButton
            title="Register"
            onPress={handleSubmit}
            loading={isLoading}
            fullWidth
            style={styles.submitButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={handleLoginPress}>
            <Text style={[styles.link, { color: colors.primary }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showCityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCityModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select City</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <Text style={[styles.modalClose, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={CITIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    formData.city === item && { backgroundColor: colors.surface },
                  ]}
                  onPress={() => handleCityChange(item)}
                >
                  <Text style={[
                    styles.modalItemText,
                    { color: colors.text },
                    formData.city === item && { color: colors.primary, fontWeight: '600' },
                  ]}>
                    {item}
                  </Text>
                  {formData.city === item && (
                    <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={[styles.modalDivider, { backgroundColor: colors.border }]} />}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
    marginBottom: 32,
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
    marginTop: 0,
    fontSize: 15,
    fontWeight: '400',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  sectionLabel: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: '#F2F2F7',
  },
  radioOptionSelected: {
    borderWidth: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 8,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  cityButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  cityButtonText: {
    fontSize: 16,
  },
  authError: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    backgroundColor: '#FFF5F5',
  },
  authErrorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 15,
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalClose: {
    fontSize: 20,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalItemText: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalDivider: {
    height: 1,
    marginHorizontal: 16,
  },
});
