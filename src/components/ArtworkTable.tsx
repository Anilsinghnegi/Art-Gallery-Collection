import React, { useMemo, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import * as Types from "../types";

interface ArtworkTableProps {
  artworks: Types.Artwork[];
  loading: boolean;
  selectedRows: Set<number>;
  onRowSelect: (rowData: Types.Artwork) => void;
  onSelectAllChange: () => void;
  isAllCurrentPageSelected: boolean;
  hasCurrentPageSelection: boolean;
}

const ArtworkTable: React.FC<ArtworkTableProps> = ({
  artworks,
  loading,
  selectedRows,
  onRowSelect,
  onSelectAllChange,
  isAllCurrentPageSelected,
  hasCurrentPageSelection,
}) => {
  // Show value or fallback to 'N/A'
  const formatDisplayValue = useCallback(
    (value: string | number | null | undefined): string => {
      return value ? String(value) : "N/A";
    },
    []
  );

  const selectedIdsArray = useMemo(
    () => Array.from(selectedRows),
    [selectedRows]
  );

  const rowCheckboxTemplate = useCallback(
    (rowData: Types.Artwork): JSX.Element => {
      const isSelected = selectedRows.has(rowData.id);
      return (
        <Checkbox
          checked={isSelected}
          onChange={() => onRowSelect(rowData)}
          inputId={`checkbox-${rowData.id}`}
          key={`row-checkbox-${rowData.id}-${isSelected}`}
        />
      );
    },
    [selectedRows, onRowSelect]
  );

  const headerCheckboxTemplate = useCallback(
    () => (
      <Checkbox
        checked={isAllCurrentPageSelected}
        indeterminate={!isAllCurrentPageSelected && hasCurrentPageSelection}
        onChange={onSelectAllChange}
        inputId="select-all-checkbox"
        key={`header-checkbox-${isAllCurrentPageSelected}-${hasCurrentPageSelection}-${selectedRows.size}`}
      />
    ),
    [
      isAllCurrentPageSelected,
      hasCurrentPageSelection,
      onSelectAllChange,
      selectedRows.size,
    ]
  );

  const idBodyTemplate = useCallback(
    (rowData: Types.Artwork) => (
      <span className="artwork-id">{rowData.id}</span>
    ),
    []
  );

  const titleBodyTemplate = useCallback(
    (rowData: Types.Artwork) => formatDisplayValue(rowData.title),
    [formatDisplayValue]
  );

  const originBodyTemplate = useCallback(
    (rowData: Types.Artwork) => formatDisplayValue(rowData.place_of_origin),
    [formatDisplayValue]
  );

  const artistBodyTemplate = useCallback(
    (rowData: Types.Artwork) => formatDisplayValue(rowData.artist_display),
    [formatDisplayValue]
  );

  const inscriptionsBodyTemplate = useCallback(
    (rowData: Types.Artwork) => formatDisplayValue(rowData.inscriptions),
    [formatDisplayValue]
  );

  const startDateBodyTemplate = useCallback(
    (rowData: Types.Artwork) => formatDisplayValue(rowData.date_start),
    [formatDisplayValue]
  );

  const endDateBodyTemplate = useCallback(
    (rowData: Types.Artwork) => formatDisplayValue(rowData.date_end),
    [formatDisplayValue]
  );

  // Helps force re-render only when selection changes
  const tableKey = useMemo(() => {
    return `datatable-${selectedRows.size}-${selectedIdsArray
      .slice(0, 5)
      .join(",")}`;
  }, [selectedRows.size, selectedIdsArray]);

  const columns = useMemo(
    () => [
      {
        key: "selection",
        header: headerCheckboxTemplate,
        body: rowCheckboxTemplate,
        style: { width: "3rem" },
        frozen: true,
        sortable: false,
      },
      {
        key: "id",
        field: "id",
        header: "ID",
        style: { minWidth: "80px", textAlign: "center" },
        body: idBodyTemplate,
        sortable: true,
      },
      {
        key: "title",
        field: "title",
        header: "Title",
        style: { minWidth: "200px" },
        body: titleBodyTemplate,
        sortable: true,
      },
      {
        key: "place_of_origin",
        field: "place_of_origin",
        header: "Place of Origin",
        style: { minWidth: "150px" },
        body: originBodyTemplate,
        sortable: true,
      },
      {
        key: "artist_display",
        field: "artist_display",
        header: "Artist",
        style: { minWidth: "200px" },
        body: artistBodyTemplate,
        sortable: true,
      },
      {
        key: "inscriptions",
        field: "inscriptions",
        header: "Inscriptions",
        style: { minWidth: "200px" },
        body: inscriptionsBodyTemplate,
        sortable: true,
      },
      {
        key: "date_start",
        field: "date_start",
        header: "Start Date",
        style: { minWidth: "100px", textAlign: "center" },
        body: startDateBodyTemplate,
        sortable: true,
      },
      {
        key: "date_end",
        field: "date_end",
        header: "End Date",
        style: { minWidth: "100px", textAlign: "center" },
        body: endDateBodyTemplate,
        sortable: true,
      },
    ],
    [
      headerCheckboxTemplate,
      rowCheckboxTemplate,
      idBodyTemplate,
      titleBodyTemplate,
      originBodyTemplate,
      artistBodyTemplate,
      inscriptionsBodyTemplate,
      startDateBodyTemplate,
      endDateBodyTemplate,
    ]
  );

  return (
    <DataTable
      value={artworks}
      loading={loading}
      className="artwork-table"
      emptyMessage="No artworks found"
      scrollable
      scrollHeight="600px"
      stripedRows
      key={tableKey}
      sortMode="multiple"
      removableSort
    >
      {columns.map((col) => (
        <Column
          key={col.key}
          field={col.field}
          header={col.header}
          body={col.body}
          style={col.style}
          frozen={col.frozen}
          sortable={col.sortable}
        />
      ))}
    </DataTable>
  );
};

export default React.memo(ArtworkTable);
