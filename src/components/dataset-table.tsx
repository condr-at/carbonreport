'use client';

/**
 * Dataset Table Component
 * 
 * Unified editable table for all project data points with:
 * - Visual grouping by field prefix
 * - Inline editing with validation
 * - Actions: Request Data, Add Item, Delete Item
 * - Optimistic updates
 */

import { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Trash2, Plus, Search } from 'lucide-react';
import { TableRow } from '@/lib/dataset-utils';
import { cn } from '@/lib/utils';

interface DatasetTableProps {
  projectId: string;
  rows: TableRow[];
  datasetVersion: number;
  onUpdate: (fieldId: string, itemId: string | null, value: string) => Promise<void>;
  onDeleteItem: (group: string, itemId: string) => Promise<void>;
  onAddItem: (group: string) => Promise<void>;
  onRequestData: (fieldId: string, itemId: string | null, group?: string) => void;
}

export function DatasetTable({
  projectId,
  rows: initialRows,
  datasetVersion,
  onUpdate,
  onDeleteItem,
  onAddItem,
  onRequestData,
}: DatasetTableProps) {
  const [rows, setRows] = useState<TableRow[]>(initialRows);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');

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

  // Editable cell component
  const EditableCell = ({ row }: { row: TableRow }) => {
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
  };

  // Define table columns
  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      {
        id: 'group',
        header: 'Group',
        accessorKey: 'group',
        cell: ({ row }) => {
          if (!row.original.isFirstInGroup) return null;

          const groupConfig = row.original.groupConfig;
          const groupRowCount = rows.filter(
            (r) => r.group === row.original.group
          ).length;

          return (
            <div
              className={cn(
                'flex items-center gap-2 p-2 font-medium',
                groupConfig.textColor
              )}
              style={{ height: `${groupRowCount * 48}px` }}
            >
              <span className="text-xl">{groupConfig.icon}</span>
              <span className="text-sm">{groupConfig.name}</span>
            </div>
          );
        },
        size: 150,
      },
      {
        id: 'fieldName',
        header: 'Field Name',
        accessorKey: 'fieldLabel',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.original.fieldLabel}</span>
            {row.original.required && (
              <Badge variant="outline" className="text-xs">
                Required
              </Badge>
            )}
          </div>
        ),
        size: 250,
      },
      {
        id: 'item',
        header: 'Item',
        accessorKey: 'itemId',
        cell: ({ row }) => (
          <div className="text-center text-muted-foreground">
            {row.original.itemId || '-'}
          </div>
        ),
        size: 80,
      },
      {
        id: 'value',
        header: 'Value',
        accessorKey: 'value',
        cell: ({ row }) => <EditableCell row={row.original} />,
        size: 300,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const currentRow = row.original;
          
          // Check if this is the last item in a repeatable group
          const repeatableItemsInGroup = rows.filter(
            r => r.group === currentRow.group && !r.isSingleton
          );
          const uniqueItemIds = new Set(
            repeatableItemsInGroup.map(r => r.itemId).filter(Boolean)
          );
          const isLastRepeatableItem = uniqueItemIds.size === 1 && !currentRow.isSingleton;
          
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onRequestData(
                    currentRow.fieldId,
                    currentRow.itemId,
                    currentRow.group
                  )
                }
                title="Request data"
              >
                <Mail className="h-4 w-4" />
              </Button>
              {/* Show delete button only for:
                  1. Repeatable fields (not singleton)
                  2. NOT the last item (must keep at least one)
              */}
              {!currentRow.isSingleton && !isLastRepeatableItem && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    currentRow.itemId &&
                    onDeleteItem(currentRow.group, currentRow.itemId)
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
    [rows, editingCell, editValue, onRequestData, onDeleteItem]
  );

  // Filter rows based on search and group selection
  const filteredRows = useMemo(() => {
    let filtered = rows;

    // Group filter
    if (selectedGroup !== 'All') {
      filtered = filtered.filter((row) => row.group === selectedGroup);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (row) =>
          row.fieldLabel.toLowerCase().includes(query) ||
          row.value.toLowerCase().includes(query) ||
          row.group.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [rows, searchQuery, selectedGroup]);

  // Get unique groups for filter dropdown
  const uniqueGroups = useMemo(() => {
    const groups = new Set(rows.map((row) => row.group));
    return ['All', ...Array.from(groups).sort()];
  }, [rows]);

  // Group rows by group for "Add Item" buttons
  const groupedRows = useMemo(() => {
    const grouped = new Map<string, TableRow[]>();
    rows.forEach((row) => {
      if (!grouped.has(row.group)) {
        grouped.set(row.group, []);
      }
      grouped.get(row.group)!.push(row);
    });
    return grouped;
  }, [rows]);

  const table = useReactTable({
    data: filteredRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {uniqueGroups.map((group) => (
            <option key={group} value={group}>
              {group === 'All' ? 'All Groups' : group}
            </option>
          ))}
        </select>
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
            {table.getRowModel().rows.map((row) => {
              const original = row.original;
              return (
                <tr
                  key={row.id}
                  className={cn(
                    'border-t transition-colors hover:bg-muted/50',
                    original.groupConfig.bgColor,
                    original.isFirstInGroup && 'border-t-2'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Item buttons for each repeatable group */}
      <div className="space-y-2">
        {Array.from(groupedRows.entries()).map(([group, groupRows]) => {
          // Only show Add button if group has repeatable items
          const hasRepeatables = groupRows.some((row) => !row.isSingleton);
          if (!hasRepeatables) return null;

          const groupConfig = groupRows[0].groupConfig;

          return (
            <div
              key={group}
              className={cn('p-4 rounded-md', groupConfig.bgColor)}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddItem(group)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {groupConfig.name} Item
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
