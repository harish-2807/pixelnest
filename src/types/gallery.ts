export interface ImageData {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export interface GalleryState {
  images: ImageData[];
  favorites: string[];
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  searchQuery: string;
  filter: 'all' | 'a-m' | 'n-z';
  sort: 'default' | 'author-asc' | 'author-desc' | 'id-asc' | 'id-desc';
}

export type FilterOption = 'all' | 'a-m' | 'n-z';
export type SortOption = 'default' | 'author-asc' | 'author-desc' | 'id-asc' | 'id-desc';

export const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'a-m', label: 'A-M' },
  { value: 'n-z', label: 'N-Z' },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'author-asc', label: 'Author A-Z' },
  { value: 'author-desc', label: 'Author Z-A' },
  { value: 'id-asc', label: 'ID Ascending' },
  { value: 'id-desc', label: 'ID Descending' },
];