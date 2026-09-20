import React, { useState, useCallback } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Share,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGalleryStore } from '../../store/useGalleryStore';
import { useTheme } from '../../hooks/useTheme';
import { AppButton } from '../../components/AppButton';
import { MainStackScreenProps } from '../../types/navigation';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library/legacy';

export const ImageDetailScreen: React.FC<MainStackScreenProps<'ImageDetail'>> = ({ route }) => {
  const { image } = route.params;
  const { isFavorite, toggleFavorite } = useGalleryStore();
  const { colors } = useTheme();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);

  const favorite = isFavorite(image.id);

  const handleFavoriteToggle = () => {
    toggleFavorite(image.id);
  };

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to save images to your gallery.');
        setIsDownloading(false);
        return;
      }

      const fileUri = `${FileSystem.Paths.cache.uri}/${image.id}.jpg`;

      const downloadResumable = FileSystem.createDownloadResumable(
        image.download_url,
        fileUri,
        {},
        (progress) => {
          const progressValue = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
          setDownloadProgress(progressValue);
        },
      );

      const result = await downloadResumable.downloadAsync();

      if (result) {
        await MediaLibrary.createAssetAsync(result.uri);
        Alert.alert('Success', 'Image saved to your gallery!');
      } else {
        throw new Error('Download failed');
      }
    } catch {
      Alert.alert('Error', 'Failed to download image. Please try again.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  }, [image]);

  const handleShare = async () => {
    try {
      await Share.share({
        title: `Photo by ${image.author}`,
        url: image.download_url,
      });
    } catch {
      Alert.alert('Error', 'Failed to share image.');
    }
  };

  return (
    <SafeAreaView style={{ ...styles.container, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.imageContainer, { backgroundColor: colors.surface }]}
          onPress={() => setShowFullScreen(true)}
          activeOpacity={0.9}
          accessibilityLabel="View full image"
          accessibilityRole="button"
        >
          <Image
            source={{ uri: image.download_url }}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel={`Photo by ${image.author}`}
          />
        </TouchableOpacity>

        <View style={[styles.infoCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <InfoRow label="Author" value={image.author} colors={colors} />
          <Divider color={colors.border} />
          <InfoRow label="Image ID" value={image.id} colors={colors} />
          <Divider color={colors.border} />
          <InfoRow label="Dimensions" value={`${image.width} × ${image.height}`} colors={colors} />
        </View>

        <View style={[styles.actionsCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                favorite && [styles.actionButtonActive, { borderColor: colors.danger }],
              ]}
              onPress={handleFavoriteToggle}
              activeOpacity={0.8}
              accessibilityLabel={favorite ? 'Remove from favorites' : 'Add to favorites'}
              accessibilityRole="button"
            >
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={24}
                color={favorite ? colors.danger : colors.text}
              />
              <Text style={[
                styles.actionLabel,
                { color: colors.text },
                favorite && { color: colors.danger },
              ]}>
                {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionRow}>
            <AppButton
              title={isDownloading ? `Downloading... ${Math.round(downloadProgress * 100)}%` : 'Download Image'}
              onPress={handleDownload}
              variant="primary"
              disabled={isDownloading}
              fullWidth
              accessibilityLabel="Download image"
            />
          </View>

          <View style={styles.actionRow}>
            <AppButton
              title="Share"
              onPress={handleShare}
              variant="outline"
              fullWidth
              accessibilityLabel="Share image"
            />
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showFullScreen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFullScreen(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowFullScreen(false)}
            accessibilityLabel="Close full screen"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Image
            source={{ uri: image.download_url }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const InfoRow: React.FC<{ label: string; value: string; colors: { textSecondary: string; text: string } }> = ({ label, value, colors }) => (
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
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
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
  actionsCard: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionRow: {
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#F2F2F7',
  },
  actionButtonActive: {
    backgroundColor: '#FFF5F5',
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  modalImage: {
    maxWidth: '95%',
    maxHeight: '85%',
  },
});
