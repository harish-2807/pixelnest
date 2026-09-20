import { useEffect, useCallback } from 'react';
import { useGalleryStore } from '../store/useGalleryStore';

export const useFetchImages = () => {
  const {
    images,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    hasMore,
    fetchImages,
    refreshImages,
    loadMore,
    clearError,
  } = useGalleryStore();

  const loadInitialImages = useCallback(() => {
    if (images.length === 0 && !isLoading && !isLoadingMore && !isRefreshing) {
      fetchImages(1, false);
    }
  }, [fetchImages, images.length, isLoading, isLoadingMore, isRefreshing]);

  useEffect(() => {
    loadInitialImages();
  }, [loadInitialImages]);

  return {
    images,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    hasMore,
    refreshImages,
    loadMore,
    clearError,
  };
};
