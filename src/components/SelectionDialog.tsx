import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { ScrollPanel } from 'primereact/scrollpanel';
import * as Types from '../types';

interface SelectionDialogProps {
  visible: boolean;
  onHide: () => void;
  selectedArtworks: Types.Artwork[];
  selectedCount: number;
  onClearAll: () => void;
  onRemoveItem: (id: number) => void;
}

const SelectionDialog: React.FC<SelectionDialogProps> = ({
  visible,
  onHide,
  selectedArtworks,
  selectedCount,
  onClearAll,
  onRemoveItem
}) => {
  const formatDisplayValue = (value: string | number | null | undefined): string => {
    return value ? String(value) : 'N/A';
  };

  const dialogFooter = (
    <div className="dialog-footer">
      <Button 
        label="Clear All" 
        icon="pi pi-trash" 
        severity="secondary" 
        onClick={onClearAll}
        disabled={selectedCount === 0}
      />
      <Button 
        label="Close" 
        icon="pi pi-times" 
        severity="secondary"
        onClick={onHide}
      />
    </div>
  );

  return (
    <Dialog
      header={`Selected Items (${selectedCount})`}
      visible={visible}
      onHide={onHide}
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
                      severity="danger"
                      text
                      rounded
                      size="small"
                      onClick={() => onRemoveItem(artwork.id)}
                      tooltip="Remove from selection"
                      style={{
                        width: '2rem',
                        height: '2rem',
                        padding: 0
                      }}
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
  );
};

export default SelectionDialog;
