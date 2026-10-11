'use client';

/**
 * Dataset Table Component
 * 
 * Unified editable table for all project data points with:
 * - Inline editing with validation
 * - Bulk data-request workflow
 * - Optimistic updates
 */

import React, { Fragment, useState, useMemo, useCallback, useEffect } from 'react';
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
import { ChevronDown, ChevronRight, Loader2, Mail, Plus, Search, Trash2 } from 'lucide-react';
import type { DataRequestSummary } from '@/lib/data-requests/types';
import { TableRow } from '@/lib/dataset-utils-v2';
import { cn } from '@/lib/utils';
import {
  useBatchedAddDatasetItem,
  useBatchedDeleteDatasetItem,
  useBatchedUpdateDatasetField,
} from '@/lib/data-client/dataset';

interface DatasetTableProps {
  projectId: string;
  rows: TableRow[];
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

type DisplayRow =
  | {
    kind: 'single';
    id: string;
    fieldLabel: string;
    fieldHint: string | null;
    data: TableRow;
  }
  | {
    kind: 'group';
    id: string;
    repeatableKey: string;
    fieldLabel: string;
    fieldHint: string | null;
    rows: TableRow[];
    items: RepeatableGroupItem[];
    matchedRowIds: Set<string>;
  };

interface RepeatableGroupItem {
  itemId: string | null;
  rows: TableRow[];
  matchedRowIds: Set<string>;
}

const formatRepeatableKey = (key: string) =>
  key
    .split(/[_-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

const REPEATABLE_GROUP_HINTS: Record<string, string> = {
  material_input:
    'Track each material input for the product, including quantity, unit, origin, and data source.',
  energy_input:
    'Capture each energy source consumed during production with its amount, unit, and renewable share.',
  transport_segment:
    'Describe every transport leg with mode, distance, load factor, and related metrics.',
  waste_stream:
    'List waste streams generated during production along with quantities and treatment routes.',
  review_team:
    'Document members of the critical review team, their affiliation, and scope of review.',
  custom_client_fields:
    'Track bespoke questionnaire fields (name, type, and the value you provided).',
};

const EditableCell = React.memo(({
  row,
  isEditing,
  isUpdating,
  onStartEdit,
  onStopEdit,
  onSave,
}: {
  row: TableRow;
  isEditing: boolean;
  isUpdating: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onSave: (row: TableRow, newValue: string) => Promise<void>;
}) => {
  const [value, setValue] = useState(row.value ?? '');

  // Sync local state with prop when not editing or when row value updates externally
  useEffect(() => {
    if (!isEditing) {
      setValue(row.value ?? '');
    }
  }, [row.value, isEditing]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          type={row.type === 'number' ? 'number' : 'text'}
          aria-label={`${row.fieldLabel} value`}
          value={value}
          disabled={isUpdating}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => {
            onSave(row, value);
            onStopEdit();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSave(row, value);
              onStopEdit();
            } else if (e.key === 'Escape') {
              setValue(row.value ?? '');
              onStopEdit();
            }
          }}
          autoFocus
          className="h-8"
        />
        {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Edit ${row.fieldLabel}${row.value ? `: ${row.value}` : ''}`}
      disabled={isUpdating}
      className={cn(
        'flex min-h-[32px] w-full items-center gap-2 rounded px-2 py-1 text-left transition hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-ring',
        isUpdating && 'cursor-wait opacity-80'
      )}
      onClick={() => {
        setValue(row.value ?? '');
        onStartEdit();
      }}
    >
      {isUpdating ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : row.value ? (
        row.value
      ) : (
        <span className="italic text-muted-foreground">Click to edit</span>
      )}
    </button>
  );
}, (prev, next) => {
  return (
    prev.isEditing === next.isEditing &&
    prev.isUpdating === next.isUpdating &&
    prev.row.value === next.row.value &&
    prev.row.fieldLabel === next.row.fieldLabel &&
    prev.row.type === next.row.type
  );
});
EditableCell.displayName = 'EditableCell';

export function DatasetTable({
  projectId,
  rows,
  onRequestData,
  onRequestMultiple,
  dataRequests = [],
}: DatasetTableProps) {
  const updateFieldMutation = useBatchedUpdateDatasetField(projectId);
  const addItemMutation = useBatchedAddDatasetItem(projectId);
  const deleteItemMutation = useBatchedDeleteDatasetItem(projectId);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    const availableKeys = new Set<string>();
    rows.forEach((row) => {
      if (row.isRepeatable && row.repeatableKey) {
        availableKeys.add(row.repeatableKey);
      }
    });

    setExpandedGroups((prev) => {
      if (prev.size === 0) {
        return new Set(availableKeys);
      }

      const next = new Set<string>();
      availableKeys.forEach((key) => {
        if (prev.has(key)) {
          next.add(key);
        }
      });

      return next;
    });
  }, [rows]);

  useEffect(() => {
    const validIds = new Set(rows.map((row) => row.id));
    setSelectedRowIds((prev) => {
      const next = new Set<string>();
      prev.forEach((id) => {
        if (validIds.has(id)) {
          next.add(id);
        }
      });
      return next;
    });
  }, [rows]);

  const handleCellSave = useCallback(
    async (row: TableRow, newValue: string) => {
      const currentValue = row.value ?? '';
      const nextValue = newValue ?? '';

      if (nextValue === currentValue) {
        setEditingCell(null);
        return;
      }

      try {
        updateFieldMutation.mutate({
          fieldId: row.fieldId,
          itemId: row.itemId ?? null,
          value: nextValue,
        });
      } finally {
        setEditingCell(null);
      }
    },
    [updateFieldMutation]
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
  const matchedRowIds = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return null;
    }

    const matchSet = new Set<string>();
    rows.forEach((row) => {
      const haystacks = [
        row.fieldLabel,
        row.value,
        row.fieldHint ?? '',
        row.repeatableKey ?? '',
        row.itemId ?? '',
      ];

      if (haystacks.some((input) => input.toLowerCase().includes(query))) {
        matchSet.add(row.id);
      }
    });

    return matchSet;
  }, [rows, searchQuery]);

  const { displayRows, visibleFieldRowIds } = useMemo(() => {
    const singles: DisplayRow[] = [];
    const visibleIds: string[] = [];
    const groupRowsByKey = new Map<string, TableRow[]>();
    const repeatableOrder: string[] = [];

    rows.forEach((row) => {
      if (row.isRepeatable && row.repeatableKey) {
        if (!groupRowsByKey.has(row.repeatableKey)) {
          groupRowsByKey.set(row.repeatableKey, []);
          repeatableOrder.push(row.repeatableKey);
        }
        groupRowsByKey.get(row.repeatableKey)!.push(row);
      } else {
        if (!matchedRowIds || matchedRowIds.has(row.id)) {
          singles.push({
            kind: 'single',
            id: row.id,
            fieldLabel: row.fieldLabel,
            fieldHint: row.fieldHint ?? null,
            data: row,
          });
          visibleIds.push(row.id);
        }
      }
    });

    const groupDisplayRows: DisplayRow[] = [];

    repeatableOrder.forEach((key) => {
      const groupRows = groupRowsByKey.get(key) ?? [];
      const itemsMap = new Map<string, TableRow[]>();

      groupRows.forEach((groupRow) => {
        const itemKey = groupRow.itemId ?? '__empty__';
        if (!itemsMap.has(itemKey)) {
          itemsMap.set(itemKey, []);
        }
        itemsMap.get(itemKey)!.push(groupRow);
      });

      const items: RepeatableGroupItem[] = [];
      itemsMap.forEach((itemRows) => {
        const matchedSet = matchedRowIds
          ? new Set(itemRows.filter((row) => matchedRowIds.has(row.id)).map((row) => row.id))
          : new Set(itemRows.map((row) => row.id));

        if (matchedRowIds && matchedSet.size === 0) {
          return;
        }

        items.push({
          itemId: itemRows[0]?.itemId ?? null,
          rows: itemRows,
          matchedRowIds: matchedSet,
        });

        itemRows.forEach((row) => {
          visibleIds.push(row.id);
        });
      });

      if (items.length === 0 && matchedRowIds) {
        return;
      }

      const matchedSet = matchedRowIds
        ? new Set(groupRows.filter((row) => matchedRowIds.has(row.id)).map((row) => row.id))
        : new Set(groupRows.map((row) => row.id));

      const groupHint = REPEATABLE_GROUP_HINTS[key] ?? groupRows.find((row) => row.fieldHint)?.fieldHint ?? null;

      groupDisplayRows.push({
        kind: 'group',
        id: `group-${key}`,
        repeatableKey: key,
        fieldLabel: formatRepeatableKey(key),
        fieldHint: groupHint,
        rows: groupRows,
        items,
        matchedRowIds: matchedSet,
      });
    });

    return {
      displayRows: [...singles, ...groupDisplayRows],
      visibleFieldRowIds: visibleIds,
    };
  }, [rows, matchedRowIds]);

  const headerCheckedState = useMemo<CheckedState>(() => {
    if (visibleFieldRowIds.length === 0) {
      return false;
    }

    let selectedVisibleCount = 0;
    for (const id of visibleFieldRowIds) {
      if (selectedRowIds.has(id)) {
        selectedVisibleCount += 1;
      }
    }

    if (selectedVisibleCount === 0) {
      return false;
    }

    if (selectedVisibleCount === visibleFieldRowIds.length) {
      return true;
    }

    return 'indeterminate';
  }, [visibleFieldRowIds, selectedRowIds]);

  const getRequestsForRow = useCallback(
    (row: TableRow) => {
      const key = row.itemId ? `${row.fieldId}::${row.itemId}` : row.fieldId;
      return requestsByField.get(key) ?? [];
    },
    [requestsByField]
  );

  const formatPendingContacts = useCallback((requests: DataRequestSummary[]) => {
    const latestPending = [...requests]
      .filter((request) => request.status === 'pending')
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())[0];

    if (!latestPending) {
      return '—';
    }

    const label = latestPending.contact?.name?.trim() || latestPending.contact?.email || null;
    return label ?? '—';
  }, []);

  const columns = useMemo<ColumnDef<DisplayRow>[]>(
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
                visibleFieldRowIds.forEach((id) => {
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
          const original = row.original;

          if (original.kind === 'group') {
            const rowIds = original.items.flatMap((item) => item.rows.map((r) => r.id));
            const selectedCount = rowIds.filter((id) => selectedRowIds.has(id)).length;
            const isChecked = selectedCount > 0 && selectedCount === rowIds.length;
            const state: CheckedState = selectedCount === 0 ? false : isChecked ? true : 'indeterminate';

            return (
              <Checkbox
                aria-label={`Select ${original.fieldLabel}`}
                checked={state}
                onCheckedChange={(checked) => {
                  const shouldSelect = checked === true;
                  setSelectedRowIds((prev) => {
                    const next = new Set(prev);
                    rowIds.forEach((id) => {
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
            );
          }

          const fieldRow = original.data;
          const isChecked = selectedRowIds.has(fieldRow.id);

          return (
            <Checkbox
              aria-label={`Select ${fieldRow.fieldLabel}`}
              checked={isChecked}
              onCheckedChange={(checked) => {
                const shouldSelect = checked === true;
                setSelectedRowIds((prev) => {
                  const next = new Set(prev);
                  if (shouldSelect) {
                    next.add(fieldRow.id);
                  } else {
                    next.delete(fieldRow.id);
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
        header: 'Field',
        accessorKey: 'fieldLabel',
        cell: ({ row }) => {
          const original = row.original;

          if (original.kind === 'group') {
            const isExpanded = expandedGroups.has(original.repeatableKey);
            return (
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  className="flex items-center gap-2 text-left"
                  onClick={() => {
                    setExpandedGroups((prev) => {
                      const next = new Set(prev);
                      if (next.has(original.repeatableKey)) {
                        next.delete(original.repeatableKey);
                      } else {
                        next.add(original.repeatableKey);
                      }
                      return next;
                    });
                  }}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">{original.fieldLabel}</span>
                </button>
                {original.fieldHint && (
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    {original.fieldHint}
                  </span>
                )}
              </div>
            );
          }

          const fieldRow = original.data;
          return (
            <div className="flex flex-col gap-1">
              <span className="font-medium">{fieldRow.fieldLabel}</span>
              {fieldRow.fieldHint && (
                <span className="text-xs text-muted-foreground">{fieldRow.fieldHint}</span>
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

          if (original.kind === 'group') {
            const allRequests = original.rows.flatMap((groupRow) => getRequestsForRow(groupRow));
            const displayValue = formatPendingContacts(allRequests);
            return <span className="text-sm text-muted-foreground">{displayValue}</span>;
          }

          const fieldRow = original.data;
          const requests = getRequestsForRow(fieldRow);
          const displayValue = formatPendingContacts(requests);
          return <span className="text-sm text-muted-foreground">{displayValue}</span>;
        },
        size: 200,
      },
      {
        id: 'value',
        header: 'Value',
        accessorKey: 'value',
        cell: ({ row }) => {
          if (row.original.kind === 'group') {
            const count = row.original.items.length;
            return (
              <span className="text-sm text-muted-foreground">
                {count} {count === 1 ? 'item' : 'items'}
              </span>
            );
          }

          const fieldRow = row.original.data;

          return (
            <EditableCell
              row={fieldRow}
              isEditing={editingCell === fieldRow.id}
              isUpdating={false}
              onStartEdit={() => setEditingCell(fieldRow.id)}
              onStopEdit={() => setEditingCell(null)}
              onSave={handleCellSave}
            />
          );
        },
        size: 220,
      },
    ],
    [
      headerCheckedState,
      visibleFieldRowIds,
      selectedRowIds,
      setSelectedRowIds,
      expandedGroups,
      setExpandedGroups,
      editingCell,
      handleCellSave,
      getRequestsForRow,
      formatPendingContacts,
    ]
  );

  const renderGroupContent = useCallback(
    (group: Extract<DisplayRow, { kind: 'group' }>) => {
      const handleAddItem = () => {
        if (!group.repeatableKey) {
          return;
        }
        // Collect field IDs for this group to initialize them optimistically
        // We can get them from the first item's rows, or if no items, we can't easily know them 
        // without looking at the table columns definition or a separate metadata source.
        // Fortunately, 'group.rows' contains ALL rows for this group across all items.
        // We can extract unique fieldIds from there.
        const fieldIds = Array.from(new Set(group.rows.map(r => r.fieldId)));

        addItemMutation.mutate({
          repeatableKey: group.repeatableKey,
          fieldIds
        });
      };

      const isAdding = false;

      if (group.items.length === 0) {
        return (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">No items yet.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddItem}
            >
              {isAdding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add {group.fieldLabel} item
            </Button>
          </div>
        );
      }

      // Build field columns from first item
      const fieldColumns = group.items[0]?.rows ?? [];

      return (
        <div className="space-y-4">
          <div className="rounded-md border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-3 py-2 w-10" />
                    {fieldColumns.map((fieldRow) => (
                      <th key={fieldRow.fieldId} className="px-3 py-2 text-left">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-sm">{fieldRow.fieldLabel}</span>
                          {fieldRow.fieldHint && (
                            <span className="text-xs font-normal text-muted-foreground">
                              {fieldRow.fieldHint}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-3 py-2 text-left w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item, index) => {
                    const itemLabel = item.itemId ? `Item ${item.itemId}` : `Item ${index + 1}`;
                    const isAnySelected = item.rows.some((row) => selectedRowIds.has(row.id));
                    const isAllSelected = item.rows.every((row) => selectedRowIds.has(row.id));
                    const rowCheckState: CheckedState = isAllSelected
                      ? true
                      : isAnySelected
                        ? 'indeterminate'
                        : false;

                    return (
                      <tr
                        key={item.itemId ?? `new-${index}`}
                        className={cn(
                          'border-t align-top transition-colors',
                          isAnySelected && 'bg-muted/40'
                        )}
                      >
                        <td className="px-3 py-2 align-top">
                          <Checkbox
                            aria-label={`Select ${itemLabel}`}
                            checked={rowCheckState}
                            onCheckedChange={(checked) => {
                              const shouldSelect = checked === true;
                              setSelectedRowIds((prev) => {
                                const next = new Set(prev);
                                item.rows.forEach((row) => {
                                  if (shouldSelect) {
                                    next.add(row.id);
                                  } else {
                                    next.delete(row.id);
                                  }
                                });
                                return next;
                              });
                            }}
                          />
                        </td>
                        {fieldColumns.map((fieldCol) => {
                          const fieldRow = item.rows.find((r) => r.fieldId === fieldCol.fieldId);
                          if (!fieldRow) {
                            return (
                              <td key={fieldCol.fieldId} className="px-3 py-2 align-top">
                                <span className="text-muted-foreground">—</span>
                              </td>
                            );
                          }

                          return (
                            <td key={fieldRow.id} className="px-3 py-2 align-top">
                              <EditableCell
                                row={fieldRow}
                                isEditing={editingCell === fieldRow.id}
                                isUpdating={false}
                                onStartEdit={() => setEditingCell(fieldRow.id)}
                                onStopEdit={() => setEditingCell(null)}
                                onSave={handleCellSave}
                              />
                            </td>
                          );
                        })}
                        <td className="px-3 py-2 align-top">
                          {item.itemId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (!item.itemId) {
                                  return;
                                }
                                deleteItemMutation.mutate({
                                  repeatableKey: group.repeatableKey,
                                  itemId: item.itemId,
                                });
                              }}
                            >
                              <Trash2 className="mr-1 h-4 w-4 text-destructive" />
                              Delete
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddItem}
            >
              {isAdding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add {group.fieldLabel} item
            </Button>
          </div>
        </div>
      );
    },
    [
      selectedRowIds,
      setSelectedRowIds,
      editingCell,
      handleCellSave,
      addItemMutation,
      deleteItemMutation,
    ]
  );

  const table = useReactTable({
    data: displayRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const columnCount = table.getVisibleLeafColumns().length;

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
            variant="primary"
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
            {table.getRowModel().rows.map((row) => {
              const original = row.original;
              const groupRow = original.kind === 'group' ? original : null;
              const isSelected =
                original.kind === 'group'
                  ? original.items.some((item) =>
                    item.rows.some((fieldRow) => selectedRowIds.has(fieldRow.id))
                  )
                  : selectedRowIds.has(original.data.id);

              return (
                <Fragment key={row.id}>
                  <tr
                    className={cn(
                      'border-t transition-colors hover:bg-muted/50',
                      isSelected && 'bg-muted/60'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {groupRow && expandedGroups.has(groupRow.repeatableKey) && (
                    <tr key={`${row.id}-details`} className="border-t">
                      <td colSpan={columnCount} className="bg-muted/30 px-6 py-4">
                        {renderGroupContent(groupRow)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {displayRows.length === 0 && (
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

export type { DataRequestSummary } from '@/lib/data-requests/types';
