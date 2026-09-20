import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Alert, Modal, FlatList, SafeAreaView } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useTheme } from '../../hooks/useTheme';
import { AppInput } from '../../components/AppInput';
import { AppButton } from '../../components/AppButton';
import { AVATARS } from '../../types/avatar';
import { User, City, CITIES } from '../../types/auth';
import { MainStackScreenProps } from '../../types/navigation';
import { validateMobile } from '../../utils/validation';

export const EditProfileScreen: React.FC<MainStackScreenProps<'EditProfile'>> = ({ navigation }) => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const { avatar, setAvatar } = useThemeStore();
  const { colors } = useTheme();
  const [formData, setFormData] = useState<Partial<User>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [showCityModal, setShowCityModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        mobile: user.mobile,
        address: user.address,
        city: user.city,
        gender: user.gender,
        avatar: user.avatar || avatar || AVATARS[0].id,
      });
    }
  }, [user, avatar]);

  const handleChange = (field: keyof User, value: string) => {
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

  const handleAvatarChange = (avatarId: string) => {
    handleChange('avatar', avatarId);
    setAvatar(avatarId);
    setShowAvatarModal(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.mobile?.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!validateMobile(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits';
    }
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city) {
      newErrors.city = 'Please select a city';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateProfile({
        fullName: formData.fullName!.trim(),
        mobile: formData.mobile!.trim(),
        address: formData.address!.trim(),
        city: formData.city!,
        gender: formData.gender!,
        avatar: formData.avatar || avatar,
      });
      Alert.alert('Success', 'Profile updated successfully', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      Alert.alert('Error', message);
    }
  };

  if (!user) {
    return null;
  }

  const selectedAvatar = AVATARS.find((a) => a.id === (formData.avatar || avatar)) || AVATARS[0];

  const genderOptions: { value: 'male' | 'female' | 'other'; label: string }[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Update your personal information</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.avatarSection}>
            <Text style={[styles.label, { color: colors.text }]}>Avatar</Text>
            <TouchableOpacity
              style={[styles.avatarSelector, { backgroundColor: colors.card }]}
              onPress={() => setShowAvatarModal(true)}
            >
              <Text style={[styles.selectedAvatarEmoji, { color: selectedAvatar.color }]}>
                {selectedAvatar.emoji}
              </Text>
              <Text style={[styles.avatarName, { color: colors.text }]}>{selectedAvatar.name}</Text>
            </TouchableOpacity>
          </View>

          <AppInput
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName || ''}
            onChangeText={(text) => handleChange('fullName', text)}
            error={errors.fullName}
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
          />

          <View style={styles.readOnlyField}>
            <Text style={[styles.readOnlyLabel, { color: colors.text }]}>Email (cannot be changed)</Text>
            <Text style={[
              styles.readOnlyValue,
              {
                color: colors.textSecondary,
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
              {user?.email}
            </Text>
          </View>

          <AppInput
            label="Mobile Number"
            placeholder="Enter 10-digit mobile number"
            value={formData.mobile || ''}
            onChangeText={(text) => handleChange('mobile', text.replace(/\D/g, '').slice(0, 10))}
            error={errors.mobile}
            keyboardType="numeric"
            autoComplete="tel"
            textContentType="telephoneNumber"
            maxLength={10}
          />

          <View style={styles.sectionLabel}>
            <Text style={[styles.label, { color: colors.text }]}>Gender</Text>
          </View>
          <View style={styles.radioGroup}>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.radioOption,
                  formData.gender === option.value && [styles.radioOptionSelected, { borderColor: colors.primary, backgroundColor: colors.surface }],
                ]}
                onPress={() => handleGenderChange(option.value)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.gender === option.value && { backgroundColor: colors.primary },
                  ]}
                />
                <Text style={[
                  styles.radioLabel,
                  { color: colors.text },
                  formData.gender === option.value && { color: colors.primary },
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <AppInput
            label="Address"
            placeholder="Enter your address"
            value={formData.address || ''}
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

          <AppButton
            title="Save Changes"
            onPress={handleSave}
            loading={isLoading}
            fullWidth
            style={styles.saveButton}
          />
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

      <Modal
        visible={showAvatarModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Avatar</Text>
              <TouchableOpacity onPress={() => setShowAvatarModal(false)}>
                <Text style={[styles.modalClose, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={AVATARS}
              keyExtractor={(item) => item.id}
              numColumns={4}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.avatarOption,
                    formData.avatar === item.id && [styles.avatarOptionSelected, { borderColor: colors.primary }],
                  ]}
                  onPress={() => handleAvatarChange(item.id)}
                >
                  <Text style={styles.avatarOptionEmoji}>{item.emoji}</Text>
                </TouchableOpacity>
              )}
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
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  avatarSection: {
    marginBottom: 16,
  },
  avatarSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  selectedAvatarEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  avatarName: {
    fontSize: 16,
    fontWeight: '500',
  },
  readOnlyField: {
    marginBottom: 16,
  },
  readOnlyLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  readOnlyValue: {
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
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
  saveButton: {
    marginTop: 8,
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
  avatarOption: {
    width: 70,
    height: 70,
    margin: 8,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarOptionSelected: {
    borderWidth: 2,
  },
  avatarOptionEmoji: {
    fontSize: 32,
  },
});
