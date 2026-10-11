import type { Dataset, DataPoint, Facility, EnergyEntry, BOMItem } from '../dataset-validation';
import type { SyncOperation } from './queue';

/** Reapply durable drafts over server data, including failed and recovered edits. */
export function overlayDatasetQueue(dataset: Dataset | null, queue: SyncOperation[], projectId: string): Dataset | null {
  const operations = queue.filter((op) => op.payload.projectId === projectId);
  if (!operations.length) return dataset;
  let next: Dataset = { ...(dataset ?? {}), data_points: [...(dataset?.data_points ?? [])] } as Dataset;
  for (const { type, payload } of operations) {
    if (type === 'dataset/update-field' && typeof payload.fieldId === 'string' && typeof payload.value === 'string') {
      const itemId = typeof payload.itemId === 'string' ? payload.itemId : null;
      const point: DataPoint = { field_id: payload.fieldId, item_id: itemId, value: payload.value };
      const index = next.data_points.findIndex((dp) => dp.field_id === point.field_id && (dp.item_id ?? null) === itemId);
      if (index < 0) next.data_points.push(point);
      else next.data_points[index] = { ...next.data_points[index], ...point };
    } else if (type === 'dataset/delete-item') {
      next.data_points = next.data_points.filter((dp) => dp.item_id !== payload.itemId);
    } else if (type === 'dataset/add-item' && Array.isArray(payload.fieldIds)) {
      for (const fieldId of payload.fieldIds) {
        if (typeof fieldId !== 'string' || typeof payload.itemId !== 'string') continue;
        if (!next.data_points.some((dp) => dp.field_id === fieldId && dp.item_id === payload.itemId)) {
          next.data_points.push({ field_id: fieldId, item_id: payload.itemId, value: '' });
        }
      }
    } else if (type.endsWith('-facility')) {
      const facilities = [...(Array.isArray(next.facilities) ? next.facilities as Facility[] : [])];
      if (type === 'dataset/add-facility') {
        const facility = payload.facility as Facility;
        if (facility && !facilities.some((item) => item.id === facility.id)) facilities.push(facility);
      } else if (type === 'dataset/update-facility') {
        const index = facilities.findIndex((item) => item.id === payload.facilityId);
        if (index >= 0 && typeof payload.field === 'string') facilities[index] = { ...facilities[index], [payload.field]: payload.value };
      }
      next = { ...next, facilities: type === 'dataset/delete-facility' ? facilities.filter((item) => item.id !== payload.facilityId) : facilities };
    } else if (type.endsWith('-energy')) {
      const entries = [...(Array.isArray(next.energy_entries) ? next.energy_entries as EnergyEntry[] : [])];
      if (type === 'dataset/add-energy') {
        const entry = payload.entry as EnergyEntry;
        if (entry && !entries.some((item) => item.id === entry.id)) entries.push(entry);
      } else if (type === 'dataset/update-energy') {
        const index = entries.findIndex((item) => item.id === payload.energyId);
        if (index >= 0 && typeof payload.field === 'string') entries[index] = { ...entries[index], [payload.field]: payload.value };
      }
      next = { ...next, energy_entries: type === 'dataset/delete-energy' ? entries.filter((item) => item.id !== payload.energyId) : entries };
    } else if (type.endsWith('-bom')) {
      const items = [...(Array.isArray(next.bom_items) ? next.bom_items as BOMItem[] : [])];
      if (type === 'dataset/add-bom') {
        const item = payload.item as BOMItem;
        if (item && !items.some((existing) => existing.id === item.id)) items.push(item);
      } else if (type === 'dataset/update-bom') {
        const index = items.findIndex((item) => item.id === payload.bomId);
        if (index >= 0 && typeof payload.field === 'string') items[index] = { ...items[index], [payload.field]: payload.value };
      }
      next = { ...next, bom_items: type === 'dataset/delete-bom' ? items.filter((item) => item.id !== payload.bomId) : items };
    }
  }
  return next;
}
