// App.tsx
import React, { useState, useEffect } from 'react';
import { Paginator } from 'primereact/paginator';
import SelectionPanel from './components/SelectionPanel';
import ArtworkTable from './components/ArtworkTable';
import SelectionDialog from './components/SelectionDialog';
import ThemeToggle from './components/ThemeToggle';
import { useArtworks } from './hooks/useArtworks';
import { useSelection } from './hooks/useSelection';
import * as Types from './types';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showSelectionDialog, setShowSelectionDialog] = useState(false);
  const [selectedArtworks, setSelectedArtworks] = useState<Types.Artwork[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const rowsPerPage = 12;

  const { artworks, loading, totalRecords, fetchArtworks, fetchSelectedArtworks } = useArtworks();

  const {
    selectedRows,
    onRowSelect,
    onSelectAllChange,
    clearAllSelections,
    removeFromSelection,
    isAllCurrentPageSelected,
    hasCurrentPageSelection
  } = useSelection();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDarkMode(shouldUseDark);
    document.documentElement.setAttribute('data-theme', shouldUseDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    const theme = newTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  useEffect(() => {
    fetchArtworks(currentPage);
  }, [currentPage, fetchArtworks]);

  useEffect(() => {
    if (showSelectionDialog) {
      const ids = Array.from(selectedRows);
      fetchSelectedArtworks(ids).then(setSelectedArtworks);
    }
  }, [showSelectionDialog, selectedRows, fetchSelectedArtworks]);

  const handlePageChange = (event: Types.PaginatorEvent) => {
    setCurrentPage(event.page + 1);
  };

  const handleSelectAll = () => {
    onSelectAllChange(artworks);
  };

  const handleClearSelection = () => {
    clearAllSelections();
    setSelectedArtworks([]);
  };

  const handleRemoveItem = (id: number) => {
    removeFromSelection(id);
    setSelectedArtworks(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <header className="app-header">
        <h1>Art Gallery Collection</h1>
        <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
      </header>

      <SelectionPanel
        selectedCount={selectedRows.size}
        selectedIds={Array.from(selectedRows)}
        onViewSelected={() => setShowSelectionDialog(true)}
        onClearAll={handleClearSelection}
      />

      <ArtworkTable
        artworks={artworks}
        loading={loading}
        selectedRows={selectedRows}
        onRowSelect={onRowSelect}
        onSelectAllChange={handleSelectAll}
        isAllCurrentPageSelected={isAllCurrentPageSelected(artworks)}
        hasCurrentPageSelection={hasCurrentPageSelection(artworks)}
      />

      <Paginator
        first={(currentPage - 1) * rowsPerPage}
        rows={rowsPerPage}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} artworks"
      />

      <SelectionDialog
        visible={showSelectionDialog}
        onHide={() => setShowSelectionDialog(false)}
        selectedArtworks={selectedArtworks}
        selectedCount={selectedRows.size}
        onClearAll={handleClearSelection}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default App;
