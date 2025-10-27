'use client';

/**
 * Dataset Table Component
 * 
 * Unified editable table for all project data points with:
 * - Inline editing with validation
 * - Actions: Request Data, Add Item, Delete Item
 * - Optimistic updates
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Trash2, Plus, Search } from 'lucide-react';
import { TableRow } from '@/lib/dataset-utils-v2';
import { cn } from '@/lib/utils';

interface DatasetTableProps {
  rows: TableRow[];
  onUpdate: (fieldId: string, itemId: string | null, value: string) => Promise<void>;
  onDeleteItem: (repeatableKey: string, itemId: string) => Promise<void>;
  onAddItem: (repeatableKey: string) => Promise<void>;
  onRequestData: (args: {
    fieldId: string;
    fieldLabel: string;
    fieldHint: string | null;
    itemId: string | null;
    repeatableKey: string | null;
  }) => void;
}

export function DatasetTable({
  rows: initialRows,
  onUpdate,
  onDeleteItem,
  onAddItem,
  onRequestData,
}: DatasetTableProps) {
  const [rows, setRows] = useState<TableRow[]>(initialRows);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
        const message = error instanceof Error ? error.message : 'Failed to update field';
        alert(message);
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
  const repeatableCounts = useMemo(() => {
    const uniqueItemCounts = new Map<string, number>();
    const seen = new Set<string>();

    rows.forEach((row) => {
      if (!row.isRepeatable || !row.repeatableKey || !row.itemId) return;
      const key = row.repeatableKey;
      const uniqueKey = `${key}::${row.itemId}`;
      if (seen.has(uniqueKey)) return;
      seen.add(uniqueKey);
      uniqueItemCounts.set(key, (uniqueItemCounts.get(key) ?? 0) + 1);
    });

    return uniqueItemCounts;
  }, [rows]);

  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      {
        id: 'fieldName',
        header: 'Field Name',
        accessorKey: 'fieldLabel',
        cell: ({ row }) => {
          const original = row.original;
          return (
            <div className="flex flex-col">
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
        id: 'item',
        header: 'Item',
        accessorKey: 'itemId',
        cell: ({ row }) => {
          const itemId = row.original.itemId;
          return (
            <div className="text-center text-muted-foreground">
              {itemId ?? '—'}
            </div>
          );
        },
        size: 80,
      },
      {
        id: 'value',
        header: 'Value',
        accessorKey: 'value',
        cell: ({ row }) => renderEditableCell(row.original),
        size: 300,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const currentRow = row.original;

          const repeatableKey = currentRow.repeatableKey;
          const itemId = currentRow.itemId;
          const repeatableItemCount = repeatableKey
            ? repeatableCounts.get(repeatableKey) ?? 0
            : 0;
          const canDelete = repeatableKey && itemId && repeatableItemCount > 1;

          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onRequestData({
                    fieldId: currentRow.fieldId,
                    fieldLabel: currentRow.fieldLabel,
                    fieldHint: currentRow.fieldHint,
                    itemId: currentRow.itemId,
                    repeatableKey: currentRow.repeatableKey,
                  })
                }
                title="Request data"
              >
                <Mail className="h-4 w-4" />
              </Button>
              {canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    currentRow.itemId &&
                    currentRow.repeatableKey &&
                    onDeleteItem(currentRow.repeatableKey, currentRow.itemId)
                  }
                  title="Delete item"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          );
        },
        size: 120,
      },
    ],
    [renderEditableCell, onRequestData, onDeleteItem, repeatableCounts]
  );

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
      {/* Search and Filters */}
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
                  'border-t transition-colors hover:bg-muted/50'
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
