import { useState, useCallback } from 'react';
import * as Types from '../types';

export const useSelection = () => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const getCurrentPageIds = useCallback((artworks: Types.Artwork[]): number[] => {
    return artworks.map((artwork: Types.Artwork) => artwork.id);
  }, []);

  const isAllCurrentPageSelected = useCallback((artworks: Types.Artwork[]): boolean => {
    const currentPageIds = getCurrentPageIds(artworks);
    return currentPageIds.length > 0 && currentPageIds.every((id: number) => selectedRows.has(id));
  }, [getCurrentPageIds, selectedRows]);

  const hasCurrentPageSelection = useCallback((artworks: Types.Artwork[]): boolean => {
    const currentPageIds = getCurrentPageIds(artworks);
    return currentPageIds.some((id: number) => selectedRows.has(id));
  }, [getCurrentPageIds, selectedRows]);

  const onRowSelect = (rowData: Types.Artwork): void => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowData.id)) {
      newSelectedRows.delete(rowData.id);
    } else {
      newSelectedRows.add(rowData.id);
    }
    setSelectedRows(newSelectedRows);
  };

  const onSelectAllChange = (artworks: Types.Artwork[]): void => {
    const newSelectedRows = new Set(selectedRows);
    const currentPageIds = getCurrentPageIds(artworks);
    
    if (isAllCurrentPageSelected(artworks)) {
      currentPageIds.forEach((id: number) => newSelectedRows.delete(id));
    } else {
      currentPageIds.forEach((id: number) => newSelectedRows.add(id));
    }
    
    setSelectedRows(newSelectedRows);
  };

  const clearAllSelections = (): void => {
    setSelectedRows(new Set<number>());
  };

  const removeFromSelection = (id: number): void => {
    const newSelectedRows = new Set(selectedRows);
    newSelectedRows.delete(id);
    setSelectedRows(newSelectedRows);
  };

  return {
    selectedRows,
    onRowSelect,
    onSelectAllChange,
    clearAllSelections,
    removeFromSelection,
    isAllCurrentPageSelected,
    hasCurrentPageSelection
  };
};
