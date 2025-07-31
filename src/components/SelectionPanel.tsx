import React from "react";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";

interface SelectionPanelProps {
  selectedCount: number;
  selectedIds: number[];
  onViewSelected: () => void;
  onClearAll: () => void;
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({
  selectedCount,
  selectedIds,
  onViewSelected,
  onClearAll,
}) => {
  return (
    <Panel header="Row Selection Summary" className="selection-panel">
      <div className="selection-info">
        <p>
          Total Selected Rows: <strong>{selectedCount}</strong>
        </p>
        <p>
          Selected IDs: {selectedIds.slice(0, 10).join(", ")}
          {selectedCount > 10 ? "..." : ""}
        </p>
      </div>
      <div className="selection-buttons">
        <Button
          label="View Selected Items"
          icon="pi pi-eye"
          severity="secondary"
          size="small"
          onClick={onViewSelected}
          disabled={selectedCount === 0}
        />
        <Button
          label="Clear All Selections"
          icon="pi pi-trash"
          severity="secondary"
          size="small"
          onClick={onClearAll}
          disabled={selectedCount === 0}
        />
      </div>
    </Panel>
  );
};

export default SelectionPanel;
