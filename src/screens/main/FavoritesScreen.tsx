import React, { useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useGalleryStore } from '../../store/useGalleryStore';
import { useDebounce } from '../../hooks/useDebounce';
import { useTheme } from '../../hooks/useTheme';
import { ImageCard } from '../../components/ImageCard';
import { SearchBar } from '../../components/SearchBar';
import { FilterBar } from '../../components/FilterBar';
import { EmptyState } from '../../components/EmptyState';
import { ImageData } from '../../types/gallery';
import { MainTabScreenProps } from '../../types/navigation';

export const FavoritesScreen: React.FC<MainTabScreenProps<'Favorites'>> = ({ navigation }) => {
  const {
    images,
    favorites,
    searchQuery,
    filter,
    sort,
    setSearchQuery,
    setFilter,
    setSort,
    isFavorite,
    toggleFavorite,
    initializeFavorites,
  } = useGalleryStore();
  const { colors } = useTheme();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const favoriteImages = useMemo(() => {
    return images.filter((img) => favorites.includes(img.id));
  }, [images, favorites]);

  const filteredFavorites = useMemo(() => {
    let result = [...favoriteImages];

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      result = result.filter((img) => img.author.toLowerCase().includes(query));
    }

    if (filter !== 'all') {
      result = result.filter((img) => {
        const firstChar = img.author.charAt(0).toLowerCase();
        if (filter === 'a-m') {
          return firstChar >= 'a' && firstChar <= 'm';
        } else {
          return firstChar >= 'n' && firstChar <= 'z';
        }
      });
    }

    switch (sort) {
      case 'author-asc':
        result.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case 'author-desc':
        result.sort((a, b) => b.author.localeCompare(a.author));
        break;
      case 'id-asc':
        result.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case 'id-desc':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        break;
    }

    return result;
  }, [favoriteImages, debouncedSearchQuery, filter, sort]);

  useEffect(() => {
    initializeFavorites();
  }, [initializeFavorites]);

  const handleImagePress = (image: ImageData) => {
    navigation.navigate('ImageDetail', { image, fromFavorites: true });
  };

  const handleFavoriteToggle = (imageId: string) => {
    toggleFavorite(imageId);
  };

  const renderItem = ({ item }: { item: ImageData }) => (
    <ImageCard
      image={item}
      isFavorite={isFavorite(item.id)}
      onPress={() => handleImagePress(item)}
      onFavoriteToggle={() => handleFavoriteToggle(item.id)}
    />
  );

  return (
    <SafeAreaView style={{ ...styles.container, backgroundColor: colors.background }}>
      <View style={{ ...styles.searchBar, backgroundColor: colors.card }}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search favorites by author..."
        />
      </View>
      <FilterBar
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
        style={{ ...styles.filterBar, backgroundColor: colors.card }}
      />
      {filteredFavorites.length === 0 ? (
        <EmptyState
          title={favorites.length === 0 ? 'No favorites yet' : 'No matching favorites'}
          message={favorites.length === 0
            ? 'Tap the heart icon on any image to add it to your favorites'
            : 'Try adjusting your search or filters'}
          style={{ ...styles.emptyContainer, backgroundColor: colors.background }}
        />
      ) : (
        <FlatList
          data={filteredFavorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    padding: 16,
  },
  filterBar: {
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
  },
});
