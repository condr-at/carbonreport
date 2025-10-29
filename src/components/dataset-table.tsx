'use client';

/**
 * Dataset Table Component
 * 
 * Unified editable table for all project data points with:
 * - Inline editing with validation
 * - Bulk data-request workflow
 * - Optimistic updates
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { CheckedState } from '@radix-ui/react-checkbox';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Plus, Search } from 'lucide-react';
import { TableRow } from '@/lib/dataset-utils-v2';
import { cn } from '@/lib/utils';

interface DatasetTableProps {
  rows: TableRow[];
  onUpdate: (fieldId: string, itemId: string | null, value: string) => Promise<void>;
  onAddItem: (repeatableKey: string) => Promise<void>;
  onRequestData: (args: {
    fieldId: string;
    fieldLabel: string;
    fieldHint: string | null;
    itemId: string | null;
    repeatableKey: string | null;
  }) => void;
  onRequestMultiple?: (fields: Array<{
    fieldId: string;
    fieldLabel: string;
    itemId: string | null;
    fieldHint: string | null;
  }>) => void;
  dataRequests?: DataRequestSummary[];
}

type RequestStatus = 'pending' | 'completed' | 'revoked';

export interface DataRequestSummary {
  id: string;
  status: RequestStatus;
  requestedAt: string;
  completedAt: string | null;
  revokedAt: string | null;
  deadline?: string | null;
  contact?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
  };
  dataPoint?: {
    id?: string | null;
    label?: string | null;
    hint?: string | null;
    itemId?: string | null;
  };
}

export function DatasetTable({
  rows: initialRows,
  onUpdate,
  onAddItem,
  onRequestData,
  onRequestMultiple,
  dataRequests = [],
}: DatasetTableProps) {
  const [rows, setRows] = useState<TableRow[]>(initialRows);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  // Optimistic update handler
  const handleCellSave = useCallback(
    async (row: TableRow, newValue: string) => {
      const oldValue = row.value;

      // Optimistic update
      setRows((prev) =>
        prev.map((r) =>
          r.id === row.id ? { ...r, value: newValue } : r
        )
      );

      try {
        await onUpdate(row.fieldId, row.itemId, newValue);
      } catch (error) {
        // Revert on error
        setRows((prev) =>
          prev.map((r) =>
            r.id === row.id ? { ...r, value: oldValue } : r
          )
        );
        console.error('Failed to update field:', error);
      }

      setEditingCell(null);
    },
    [onUpdate]
  );

  const renderEditableCell = useCallback(
    (row: TableRow) => {
      const isEditing = editingCell === row.id;

      if (isEditing) {
        return (
          <Input
            type={row.type === 'number' ? 'number' : 'text'}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleCellSave(row, editValue)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCellSave(row, editValue);
              } else if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            autoFocus
            className="h-8"
          />
        );
      }

      return (
        <div
          className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded min-h-[32px] flex items-center"
          onClick={() => {
            setEditingCell(row.id);
            setEditValue(row.value);
          }}
        >
          {row.value || (
            <span className="text-muted-foreground italic">Click to edit</span>
          )}
        </div>
      );
    },
    [editingCell, editValue, handleCellSave]
  );

  // Define table columns
  const requestsByField = useMemo(() => {
    const map = new Map<string, DataRequestSummary[]>();
    dataRequests.forEach((request) => {
      const key = request.dataPoint?.id ?? null;
      if (!key) {
        return;
      }
      const compoundKey = request.dataPoint?.itemId
        ? `${key}::${request.dataPoint.itemId}`
        : key;
      if (!map.has(compoundKey)) {
        map.set(compoundKey, []);
      }
      map.get(compoundKey)!.push(request);
    });
    return map;
  }, [dataRequests]);

  const allRows = useMemo(() => rows, [rows]);

  // Filter rows based on search
  const filteredRows = useMemo(() => {
    if (!searchQuery) return allRows;
    const query = searchQuery.toLowerCase();
    return allRows.filter((row) =>
      row.fieldLabel.toLowerCase().includes(query) ||
      row.value.toLowerCase().includes(query) ||
      (row.repeatableKey ?? '').toLowerCase().includes(query)
    );
  }, [allRows, searchQuery]);

  const visibleRowIds = useMemo(() => filteredRows.map((row) => row.id), [filteredRows]);

  const headerCheckedState = useMemo<CheckedState>(() => {
    if (visibleRowIds.length === 0) {
      return false;
    }

    let selectedVisibleCount = 0;
    for (const id of visibleRowIds) {
      if (selectedRowIds.has(id)) {
        selectedVisibleCount += 1;
      }
    }

    if (selectedVisibleCount === 0) {
      return false;
    }

    if (selectedVisibleCount === visibleRowIds.length) {
      return true;
    }

    return 'indeterminate';
  }, [visibleRowIds, selectedRowIds]);

  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      {
        id: 'select',
        header: () => (
          <Checkbox
            aria-label={headerCheckedState === true ? 'Deselect all rows' : 'Select all rows'}
            checked={headerCheckedState}
            onCheckedChange={(checked) => {
              const shouldSelect = checked === true;
              setSelectedRowIds((prev) => {
                const next = new Set(prev);
                visibleRowIds.forEach((id) => {
                  if (shouldSelect) {
                    next.add(id);
                  } else {
                    next.delete(id);
                  }
                });
                return next;
              });
            }}
          />
        ),
        cell: ({ row }) => {
          const isChecked = selectedRowIds.has(row.original.id);
          return (
            <Checkbox
              aria-label={`Select ${row.original.fieldLabel}`}
              checked={isChecked}
              onCheckedChange={(checked) => {
                const shouldSelect = checked === true;
                setSelectedRowIds((prev) => {
                  const next = new Set(prev);
                  if (shouldSelect) {
                    next.add(row.original.id);
                  } else {
                    next.delete(row.original.id);
                  }
                  return next;
                });
              }}
            />
          );
        },
        size: 40,
      },
      {
        id: 'fieldName',
        header: 'Field Name',
        accessorKey: 'fieldLabel',
        cell: ({ row }) => {
          const original = row.original;
          return (
            <div className="flex flex-col gap-1">
              <span className="font-medium">{original.fieldLabel}</span>
              {original.fieldHint && (
                <span className="text-xs text-muted-foreground">
                  {original.fieldHint}
                </span>
              )}
            </div>
          );
        },
        size: 320,
      },
      {
        id: 'responsible',
        header: 'Responsible',
        cell: ({ row }) => {
          const original = row.original;
          const fieldKey = original.itemId
            ? `${original.fieldId}::${original.itemId}`
            : original.fieldId;
          const relatedRequests = requestsByField.get(fieldKey) ?? [];
          const pendingContacts = relatedRequests
            .filter((request) => request.status === 'pending')
            .map((request) => request.contact?.name?.trim() || request.contact?.email || null)
            .filter((label): label is string => Boolean(label));

          const uniqueContacts = Array.from(new Set(pendingContacts));
          const displayValue = uniqueContacts.length > 0 ? uniqueContacts.join(', ') : '—';

          return <span className="text-sm text-muted-foreground">{displayValue}</span>;
        },
        size: 180,
      },
      {
        id: 'value',
        header: 'Value',
        accessorKey: 'value',
        cell: ({ row }) => renderEditableCell(row.original),
        size: 300,
      },
    ],
    [
      headerCheckedState,
      visibleRowIds,
      selectedRowIds,
      setSelectedRowIds,
      requestsByField,
      renderEditableCell,
    ]
  );

  const repeatableGroups = useMemo(() => {
    const groups = new Map<string, TableRow[]>();
    rows.forEach((row) => {
      if (!row.isRepeatable || !row.repeatableKey) return;
      if (!groups.has(row.repeatableKey)) {
        groups.set(row.repeatableKey, []);
      }
      groups.get(row.repeatableKey)!.push(row);
    });
    return groups;
  }, [rows]);

  const table = useReactTable({
    data: filteredRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        {selectedRowIds.size > 0 && (
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              const selectedRows = rows.filter((r) => selectedRowIds.has(r.id));
              const fields = selectedRows.map((row) => ({
                fieldId: row.fieldId,
                fieldLabel: row.fieldLabel,
                itemId: row.itemId ?? null,
                fieldHint: row.fieldHint ?? null,
              }));
              
              if (onRequestMultiple) {
                onRequestMultiple(fields);
              } else if (fields.length > 0) {
                // Fallback for backward compat
                onRequestData({
                  fieldId: fields[0].fieldId,
                  fieldLabel: `${fields.length} fields`,
                  fieldHint: null,
                  itemId: null,
                  repeatableKey: null,
                });
              }
              setSelectedRowIds(new Set());
            }}
          >
            <Mail className="h-4 w-4 mr-2" />
            Request Selected ({selectedRowIds.size})
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'border-t transition-colors hover:bg-muted/50',
                  selectedRowIds.has(row.original.id) && 'bg-muted/60'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Item buttons for each repeatable group */}
      <div className="space-y-2">
        {Array.from(repeatableGroups.entries()).map(([repeatableKey, groupRows]) => {
          const label = groupRows[0]?.fieldLabel.split(' ').slice(0, 3).join(' ') || repeatableKey;

          return (
            <div key={repeatableKey} className="p-4 rounded-md border bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Repeatable group: {repeatableKey}
                </span>
                <span className="text-xs text-muted-foreground">
                  Items: {new Set(groupRows.map((row) => row.itemId).filter(Boolean)).size}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddItem(repeatableKey)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {label} item
              </Button>
            </div>
          );
        })}
      </div>

      {filteredRows.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No data points found.</p>
          <p className="text-sm mt-1">
            {searchQuery
              ? 'Try adjusting your search or filters.'
              : 'Add fields from report templates or create custom fields.'}
          </p>
        </div>
      )}
    </div>
  );
}
