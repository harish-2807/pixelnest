import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GalleryState, ImageData, FilterOption, SortOption } from '../types/gallery';
import { fetchImages } from '../api/picsumApi';
import { storage } from '../utils/storage';

interface GalleryStore extends GalleryState {
  fetchImages: (page?: number, append?: boolean) => Promise<void>;
  refreshImages: () => Promise<void>;
  loadMore: () => Promise<void>;
  addFavorite: (imageId: string) => void;
  removeFavorite: (imageId: string) => void;
  toggleFavorite: (imageId: string) => void;
  isFavorite: (imageId: string) => boolean;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: FilterOption) => void;
  setSort: (sort: SortOption) => void;
  clearError: () => void;
  resetGallery: () => void;
  initializeFavorites: () => Promise<void>;
  getFilteredAndSortedImages: () => ImageData[];
}

const applyFiltersAndSort = (
  images: ImageData[],
  searchQuery: string,
  filter: FilterOption,
  sort: SortOption
): ImageData[] => {
  let result = [...images];

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
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
};

const deduplicateImages = (images: ImageData[]): ImageData[] => {
  const seen = new Set<string>();
  return images.filter((img) => {
    if (seen.has(img.id)) {
      return false;
    }
    seen.add(img.id);
    return true;
  });
};

const deduplicateFavorites = (favorites: string[]): string[] => {
  return [...new Set(favorites)];
};

export const useGalleryStore = create<GalleryStore>()(
  persist(
    (set, get) => ({
      images: [],
      favorites: [],
      isLoading: false,
      isLoadingMore: false,
      isRefreshing: false,
      error: null,
      currentPage: 1,
      hasMore: true,
      searchQuery: '',
      filter: 'all',
      sort: 'default',

      clearError: () => set({ error: null }),

      resetGallery: () => {
        set({
          searchQuery: '',
          filter: 'all',
          sort: 'default',
          error: null,
          isLoading: false,
          isLoadingMore: false,
          isRefreshing: false,
        });
      },

      initializeFavorites: async () => {
        const favorites = await storage.getFavorites();
        set({ favorites: deduplicateFavorites(favorites) });
      },

      fetchImages: async (page = 1, append = false) => {
        const { isLoading, isLoadingMore, isRefreshing } = get();
        
        if (append) {
          if (isLoadingMore) return;
          set({ isLoadingMore: true, error: null });
        } else if (page === 1) {
          if (isLoading || isRefreshing) return;
          set({ isLoading: true, error: null });
        }

        try {
          const newImages = await fetchImages(page);
          
          if (newImages.length === 0) {
            set({ hasMore: false });
            if (append) set({ isLoadingMore: false });
            else set({ isLoading: false, isRefreshing: false });
            return;
          }

          const currentImages = get().images;
          const combinedImages = append 
            ? deduplicateImages([...currentImages, ...newImages])
            : deduplicateImages(newImages);

          set({
            images: combinedImages,
            currentPage: page,
            hasMore: newImages.length >= 20,
            isLoading: false,
            isLoadingMore: false,
            isRefreshing: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch images';
          set({
            error: message,
            isLoading: false,
            isLoadingMore: false,
            isRefreshing: false,
          });
        }
      },

      refreshImages: async () => {
        const { isRefreshing, isLoading } = get();
        if (isRefreshing || isLoading) return;
        
        set({ isRefreshing: true, error: null, currentPage: 1, hasMore: true });
        await get().fetchImages(1, false);
      },

      loadMore: async () => {
        const { hasMore, isLoadingMore, currentPage } = get();
        if (!hasMore || isLoadingMore) return;
        
        await get().fetchImages(currentPage + 1, true);
      },

      addFavorite: (imageId: string) => {
        const { favorites } = get();
        if (favorites.includes(imageId)) return;
        
        const newFavorites = deduplicateFavorites([...favorites, imageId]);
        set({ favorites: newFavorites });
        storage.setFavorites(newFavorites);
      },

      removeFavorite: (imageId: string) => {
        const { favorites } = get();
        const newFavorites = favorites.filter((id) => id !== imageId);
        
        set({ favorites: newFavorites });
        storage.setFavorites(newFavorites);
      },

      toggleFavorite: (imageId: string) => {
        const { favorites } = get();
        if (favorites.includes(imageId)) {
          get().removeFavorite(imageId);
        } else {
          get().addFavorite(imageId);
        }
      },

      isFavorite: (imageId: string): boolean => {
        const { favorites } = get();
        return favorites.includes(imageId);
      },

      setSearchQuery: (query: string) => set({ searchQuery: query }),
      setFilter: (filter: FilterOption) => set({ filter }),
      setSort: (sort: SortOption) => set({ sort }),

      getFilteredAndSortedImages: () => {
        const { images, searchQuery, filter, sort } = get();
        return applyFiltersAndSort(images, searchQuery, filter, sort);
      },
    }),
    {
      name: 'gallery-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);
