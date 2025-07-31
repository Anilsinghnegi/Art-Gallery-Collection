import { useState, useCallback } from 'react';
import * as Types from '../types'

export const useArtworks = () => {
  const [artworks, setArtworks] = useState<Types.Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const fetchArtworks = useCallback(async (page: number): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${page}&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setArtworks(data.data);
      setTotalRecords(data.pagination.total);
      
    } catch (error) {
      console.error('Error fetching artworks:', error);
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSelectedArtworks = useCallback(async (selectedIds: number[]): Promise<Types.Artwork[]> => {
    if (selectedIds.length === 0) {
      return [];
    }

    try {
      const promises = selectedIds.map(async (id) => {
        const response = await fetch(
          `https://api.artic.edu/api/v1/artworks/${id}?fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`
        );
        const result = await response.json();
        return result.data;
      });

      return await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching selected artworks:', error);
      return [];
    }
  }, []);

  return {
    artworks,
    loading,
    totalRecords,
    fetchArtworks,
    fetchSelectedArtworks
  };
};
