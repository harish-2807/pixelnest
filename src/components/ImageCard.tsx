import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { ImageData } from '../types/gallery';

interface ImageCardProps {
  image: ImageData;
  isFavorite: boolean;
  onPress: () => void;
  onFavoriteToggle: () => void;
  style?: ViewStyle;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  isFavorite,
  onPress,
  onFavoriteToggle,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.card, shadowColor: colors.shadow },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityLabel={`Image by ${image.author}`}
      accessibilityRole="button"
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image.download_url }}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={`Photo by ${image.author}, ID ${image.id}`}
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            onFavoriteToggle();
          }}
          activeOpacity={0.8}
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          accessibilityRole="button"
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? colors.danger : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={[styles.author, { color: colors.text }]} numberOfLines={1}>
          {image.author}
        </Text>
        <Text style={[styles.id, { color: colors.textSecondary }]}>
          ID: {image.id}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 3 / 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  info: {
    padding: 12,
  },
  author: {
    fontSize: 16,
    fontWeight: '600',
  },
  id: {
    fontSize: 12,
    marginTop: 2,
  },
});
