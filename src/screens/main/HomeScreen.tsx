import React, { useCallback, useMemo } from 'react';
import { View, FlatList, RefreshControl, StyleSheet, SafeAreaView } from 'react-native';
import { useGalleryStore } from '../../store/useGalleryStore';
import { useFetchImages } from '../../hooks/useFetchImages';
import { useDebounce } from '../../hooks/useDebounce';
import { useTheme } from '../../hooks/useTheme';
import { ImageCard } from '../../components/ImageCard';
import { SearchBar } from '../../components/SearchBar';
import { FilterBar } from '../../components/FilterBar';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { ImageData } from '../../types/gallery';
import { MainTabScreenProps } from '../../types/navigation';

export const HomeScreen: React.FC<MainTabScreenProps<'Home'>> = ({ navigation }) => {
  const {
    images,
    isLoading,
    isRefreshing,
    error,
    hasMore,
    searchQuery,
    filter,
    sort,
    refreshImages,
    loadMore,
    setSearchQuery,
    setFilter,
    setSort,
    getFilteredAndSortedImages,
    isFavorite,
    toggleFavorite,
  } = useGalleryStore();
  const { colors } = useTheme();

  useFetchImages();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const filteredImages = useMemo(() => getFilteredAndSortedImages(), [debouncedSearchQuery, filter, sort, images]);

  const handleRefresh = useCallback(async () => {
    await refreshImages();
  }, [refreshImages]);

  const handleLoadMore = useCallback(async () => {
    await loadMore();
  }, [loadMore]);

  const handleImagePress = (image: ImageData) => {
    navigation.navigate('ImageDetail', { image, fromFavorites: false });
  };

  const handleFavoriteToggle = (imageId: string) => {
    toggleFavorite(imageId);
  };

  const renderItem = useCallback(({ item }: { item: ImageData }) => (
    <ImageCard
      image={item}
      isFavorite={isFavorite(item.id)}
      onPress={() => handleImagePress(item)}
      onFavoriteToggle={() => handleFavoriteToggle(item.id)}
    />
  ), [isFavorite, handleImagePress, handleFavoriteToggle]);

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footerLoader}>
        <LoadingIndicator message="Loading more..." size="small" />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={{ ...styles.fullScreenLoader, backgroundColor: colors.background }}>
        <LoadingIndicator message="Loading images..." />
      </View>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={handleRefresh}
        style={{ ...styles.errorContainer, backgroundColor: colors.background }}
      />
    );
  }

  if (filteredImages.length === 0) {
    return (
      <EmptyState
        title={searchQuery || filter !== 'all' || sort !== 'default'
          ? 'No matching images'
          : 'No images available'}
        message={searchQuery || filter !== 'all' || sort !== 'default'
          ? 'Try adjusting your search or filters'
          : 'No images available at the moment'}
        style={{ ...styles.emptyContainer, backgroundColor: colors.background }}
      />
    );
  }

  return (
    <SafeAreaView style={{ ...styles.container, backgroundColor: colors.background }}>
      <View style={{ ...styles.searchBar, backgroundColor: colors.card }}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by author..."
        />
      </View>
      <FilterBar
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
        style={{ ...styles.filterBar, backgroundColor: colors.card }}
      />
      <FlatList
        data={filteredImages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenLoader: {
    flex: 1,
  },
  searchBar: {
    padding: 16,
  },
  filterBar: {},
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
  },
});
