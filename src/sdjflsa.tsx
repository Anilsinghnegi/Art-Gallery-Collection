import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Dialog } from 'primereact/dialog';
import { Chip } from 'primereact/chip';
import { ScrollPanel } from 'primereact/scrollpanel';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

interface ApiResponse {
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
  };
}

interface PaginatorEvent {
  page: number;
  first: number;
  rows: number;
  pageCount: number;
}

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showSelectionDialog, setShowSelectionDialog] = useState<boolean>(false);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);

  const rowsPerPage: number = 12;

  const getCurrentPageIds = useCallback((): number[] => {
    return artworks.map((artwork: Artwork) => artwork.id);
  }, [artworks]);

  const isAllCurrentPageSelected = useCallback((): boolean => {
    const currentPageIds = getCurrentPageIds();
    return currentPageIds.length > 0 && currentPageIds.every((id: number) => selectedRows.has(id));
  }, [getCurrentPageIds, selectedRows]);

  const fetchArtworks = useCallback(async (page: number): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${page}&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const  ApiResponse = await response.json();
      
      setArtworks(data.data);
      setTotalRecords(data.pagination.total);
      
    } catch (error) {
      console.error('Error fetching artworks:', error);
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch selected artworks details for popup
  const fetchSelectedArtworks = useCallback(async (): Promise<void> => {
    if (selectedRows.size === 0) {
      setSelectedArtworks([]);
      return;
    }

    try {
      const selectedIds = Array.from(selectedRows);
      const promises = selectedIds.map(async (id) => {
        const response = await fetch(
          `https://api.artic.edu/api/v1/artworks/${id}?fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`
        );
        const result = await response.json();
        return result.data;
      });

      const artworksData = await Promise.all(promises);
      setSelectedArtworks(artworksData);
    } catch (error) {
      console.error('Error fetching selected artworks:', error);
    }
  }, [selectedRows]);

  useEffect(() => {
    fetchArtworks(currentPage);
  }, [currentPage, fetchArtworks]);

  useEffect(() => {
    if (showSelectionDialog) {
      fetchSelectedArtworks();
    }
  }, [showSelectionDialog, fetchSelectedArtworks]);

  const onPageChange = (event: PaginatorEvent): void => {
    const newPage: number = event.page + 1;
    setCurrentPage(newPage);
  };

  const onRowSelect = (rowData: Artwork): void => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowData.id)) {
      newSelectedRows.delete(rowData.id);
    } else {
      newSelectedRows.add(rowData.id);
    }
    setSelectedRows(newSelectedRows);
  };

  const onSelectAllChange = (): void => {
    const newSelectedRows = new Set(selectedRows);
    const currentPageIds = getCurrentPageIds();
    
    if (isAllCurrentPageSelected()) {
      currentPageIds.forEach((id: number) => newSelectedRows.delete(id));
    } else {
      currentPageIds.forEach((id: number) => newSelectedRows.add(id));
    }
    
    setSelectedRows(newSelectedRows);
  };

  const clearAllSelections = (): void => {
    setSelectedRows(new Set<number>());
    setSelectedArtworks([]);
  };

  const removeFromSelection = (id: number): void => {
    const newSelectedRows = new Set(selectedRows);
    newSelectedRows.delete(id);
    setSelectedRows(newSelectedRows);
    setSelectedArtworks(prev => prev.filter(artwork => artwork.id !== id));
  };

  const rowCheckboxTemplate = (rowData: Artwork): JSX.Element => {
    return (
      <Checkbox
        checked={selectedRows.has(rowData.id)}
        onChange={() => onRowSelect(rowData)}
        inputId={`checkbox-${rowData.id}`}
      />
    );
  };

  const headerCheckboxTemplate = (): JSX.Element => {
    const allSelected = isAllCurrentPageSelected();
    const currentPageIds = getCurrentPageIds();
    const someSelected = currentPageIds.some((id: number) => selectedRows.has(id));
    
    return (
      <Checkbox
        checked={allSelected}
        indeterminate={!allSelected && someSelected}
        onChange={onSelectAllChange}
        inputId="select-all-checkbox"
      />
    );
  };

  const formatDisplayValue = (value: string | number | null | undefined): string => {
    return value ? String(value) : 'N/A';
  };

  const dialogFooter = (
    <div className="dialog-footer">
      <Button 
        label="Clear All" 
        icon="pi pi-trash" 
        severity="danger" 
        onClick={clearAllSelections}
        disabled={selectedRows.size === 0}
      />
      <Button 
        label="Close" 
        icon="pi pi-times" 
        onClick={() => setShowSelectionDialog(false)}
      />
    </div>
  );

  return (
    <div className="app">
      <h1>Art Gallery Collection</h1>
      
      <Panel header="Row Selection Summary" className="selection-panel">
        <div className="selection-info">
          <p>Total Selected Rows: <strong>{selectedRows.size}</strong></p>
          <p>Selected IDs: {Array.from(selectedRows).slice(0, 10).join(', ')}{selectedRows.size > 10 ? '...' : ''}</p>
          <div className="selection-buttons">
            <Button 
              label="View Selected Items" 
              icon="pi pi-eye"
              severity="info"
              size="small"
              onClick={() => setShowSelectionDialog(true)}
              disabled={selectedRows.size === 0}
            />
            <Button 
              label="Clear All Selections" 
              icon="pi pi-trash"
              severity="secondary" 
              size="small"
              onClick={clearAllSelections}
              disabled={selectedRows.size === 0}
            />
          </div>
        </div>
      </Panel>

      <DataTable
        value={artworks}
        loading={loading}
        className="artwork-table"
        emptyMessage="No artworks found"
        scrollable
        scrollHeight="600px"
        stripedRows
      >
        <Column
          header={headerCheckboxTemplate}
          body={rowCheckboxTemplate}
          style={{ width: '3rem' }}
          frozen
        />
        <Column
          field="title"
          header="Title"
          style={{ minWidth: '200px' }}
          body={(rowData: Artwork) => formatDisplayValue(rowData.title)}
        />
        <Column
          field="place_of_origin"
          header="Place of Origin"
          style={{ minWidth: '150px' }}
          body={(rowData: Artwork) => formatDisplayValue(rowData.place_of_origin)}
        />
        <Column
          field="artist_display"
          header="Artist"
          style={{ minWidth: '200px' }}
          body={(rowData: Artwork) => formatDisplayValue(rowData.artist_display)}
        />
        <Column
          field="inscriptions"
          header="Inscriptions"
          style={{ minWidth: '200px' }}
          body={(rowData: Artwork) => formatDisplayValue(rowData.inscriptions)}
        />
        <Column
          field="date_start"
          header="Start Date"
          style={{ minWidth: '100px' }}
          body={(rowData: Artwork) => formatDisplayValue(rowData.date_start)}
        />
        <Column
          field="date_end"
          header="End Date"
          style={{ minWidth: '100px' }}
          body={(rowData: Artwork) => formatDisplayValue(rowData.date_end)}
        />
      </DataTable>

      <Paginator
        first={(currentPage - 1) * rowsPerPage}
        rows={rowsPerPage}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} artworks"
      />

      {/* Selection Dialog/Popup */}
      <Dialog
        header={`Selected Items (${selectedRows.size})`}
        visible={showSelectionDialog}
        onHide={() => setShowSelectionDialog(false)}
        style={{ width: '80vw', maxWidth: '1000px' }}
        footer={dialogFooter}
        maximizable
        modal
      >
        <div className="selected-items-container">
          {selectedArtworks.length === 0 ? (
            <p>Loading selected items...</p>
          ) : (
            <ScrollPanel style={{ width: '100%', height: '400px' }}>
              <div className="selected-items-grid">
                {selectedArtworks.map((artwork) => (
                  <div key={artwork.id} className="selected-item-card">
                    <div className="item-header">
                      <Chip 
                        label={`ID: ${artwork.id}`} 
                        className="item-id-chip"
                      />
                      <Button
                        icon="pi pi-times"
                        className="p-button-rounded p-button-text p-button-danger"
                        size="small"
                        onClick={() => removeFromSelection(artwork.id)}
                        tooltip="Remove from selection"
                      />
                    </div>
                    <div className="item-details">
                      <h4>{formatDisplayValue(artwork.title)}</h4>
                      <p><strong>Artist:</strong> {formatDisplayValue(artwork.artist_display)}</p>
                      <p><strong>Origin:</strong> {formatDisplayValue(artwork.place_of_origin)}</p>
                      <p><strong>Period:</strong> {formatDisplayValue(artwork.date_start)} - {formatDisplayValue(artwork.date_end)}</p>
                      {artwork.inscriptions && (
                        <p><strong>Inscriptions:</strong> {formatDisplayValue(artwork.inscriptions)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollPanel>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default App;
