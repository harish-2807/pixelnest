import { ImageData } from '../types/gallery';

const BASE_URL = 'https://picsum.photos/v2/list';

export const fetchImages = async (page: number = 1, limit: number = 20): Promise<ImageData[]> => {
  const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch images: ${response.status}`);
  }

  return response.json();
};
