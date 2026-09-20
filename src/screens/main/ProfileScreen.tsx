import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useTheme } from '../../hooks/useTheme';
import { AVATARS } from '../../types/avatar';
import { AppButton } from '../../components/AppButton';
import { MainTabScreenProps } from '../../types/navigation';
import { ThemeColors } from '../../types/theme';

export const ProfileScreen: React.FC<MainTabScreenProps<'Profile'>> = ({ navigation }) => {
  const { user, logout, isLoading: authLoading } = useAuthStore();
  const { avatar, setAvatar } = useThemeStore();
  const { theme, toggleTheme } = useThemeStore();
  const { colors } = useTheme();

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: handleLogoutConfirm },
      ],
    );
  };

  const handleLogoutConfirm = async () => {
    await logout();
  };

  const handleThemeToggle = () => {
    const newMode = theme.mode === 'light' ? 'dark' : 'light';
    Alert.alert(
      'Theme',
      `Switch to ${newMode} mode?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: `Switch to ${newMode}`, onPress: toggleTheme },
      ],
    );
  };

  const handleAvatarChange = () => {
    Alert.alert(
      'Select Avatar',
      'Choose your avatar',
      [
        ...AVATARS.slice(0, 6).map((a) => ({
          text: `${a.emoji} ${a.name}`,
          onPress: () => setAvatar(a.id),
        })),
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  const selectedAvatar = AVATARS.find((a) => a.id === avatar) || AVATARS[0];

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.profileHeader, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <TouchableOpacity
            style={[styles.avatarContainer, { backgroundColor: selectedAvatar.color }]}
            onPress={handleAvatarChange}
            accessibilityLabel="Change avatar"
            accessibilityRole="button"
          >
            <Text style={styles.avatarText} accessibilityLabel={`Avatar: ${selectedAvatar.name}`}>
              {selectedAvatar.emoji}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.name, { color: colors.text }]}>{user.fullName}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{user.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Personal Information</Text>
          <View style={[styles.infoCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <InfoRow label="Full Name" value={user.fullName} colors={colors} />
            <Divider color={colors.border} />
            <InfoRow label="Email" value={user.email} colors={colors} />
            <Divider color={colors.border} />
            <InfoRow label="Mobile" value={user.mobile} colors={colors} />
            <Divider color={colors.border} />
            <InfoRow label="Gender" value={user.gender.charAt(0).toUpperCase() + user.gender.slice(1)} colors={colors} />
            <Divider color={colors.border} />
            <InfoRow label="Address" value={user.address} colors={colors} />
            <Divider color={colors.border} />
            <InfoRow label="City" value={user.city} colors={colors} />
          </View>
        </View>

        <View style={styles.section}>
          <AppButton
            title="Edit Profile"
            onPress={handleEditProfile}
            variant="outline"
            fullWidth
            accessibilityLabel="Edit profile"
          />
        </View>

        <View style={styles.section}>
          <AppButton
            title={`Switch to ${theme.mode === 'light' ? 'Dark' : 'Light'} Mode`}
            onPress={handleThemeToggle}
            variant="secondary"
            fullWidth
            accessibilityLabel="Toggle theme"
          />
        </View>

        <View style={styles.section}>
          <AppButton
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            fullWidth
            loading={authLoading}
            accessibilityLabel="Logout"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow: React.FC<{ label: string; value: string; colors: ThemeColors }> = ({ label, value, colors }) => (
  <View style={styles.infoRow}>
    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
    <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
  </View>
);

const Divider: React.FC<{ color: string }> = ({ color }) => (
  <View style={[styles.divider, { backgroundColor: color }]} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    borderRadius: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 52,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
  },
  email: {
    marginTop: 4,
    fontSize: 15,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  infoLabel: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
});
