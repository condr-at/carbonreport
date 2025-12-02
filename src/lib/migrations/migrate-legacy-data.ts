import { Dataset, DataPoint } from '@/lib/dataset-validation';

/**
 * Migration Utility: Legacy Arrays -> Normalized Data Points
 * 
 * Converts legacy 'facilities', 'bom_items', and 'energy_entries' arrays
 * into the unified 'data_points' structure using Repeatable Groups.
 */

export function migrateLegacyData(dataset: Dataset): Dataset {
    const newDataPoints: DataPoint[] = [...dataset.data_points];
    let hasChanges = false;

    // Create a lookup map for existing data points: "field_id::item_id" -> true
    const existingMap = new Set<string>();
    for (const dp of newDataPoints) {
        if (dp.item_id) {
            existingMap.add(`${dp.field_id}::${dp.item_id}`);
        }
    }

    // 1. Migrate Facilities -> Organization Info
    if (dataset.facilities && dataset.facilities.length > 0) {
        dataset.facilities.forEach(facility => {
            // Check if already migrated
            const key = `organization_name::${facility.id}`;

            if (!existingMap.has(key)) {
                newDataPoints.push(
                    { field_id: 'organization_name', item_id: facility.id, value: facility.name },
                    { field_id: 'organization_address', item_id: facility.id, value: facility.address },
                    { field_id: 'facility_country', item_id: facility.id, value: facility.country }
                );
                // Add to map to prevent duplicates if we somehow process twice
                existingMap.add(key);
                existingMap.add(`organization_address::${facility.id}`);
                existingMap.add(`facility_country::${facility.id}`);
                hasChanges = true;
            }
        });
    }

    // 2. Migrate BOM Items -> Material Input
    if (dataset.bom_items && dataset.bom_items.length > 0) {
        dataset.bom_items.forEach(item => {
            const key = `material_input_name::${item.id}`;

            if (!existingMap.has(key)) {
                newDataPoints.push(
                    { field_id: 'material_input_name', item_id: item.id, value: item.name },
                    { field_id: 'material_input_amount', item_id: item.id, value: item.weight.toString() },
                    { field_id: 'material_origin_country', item_id: item.id, value: item.origin },
                    { field_id: 'bom_type', item_id: item.id, value: item.materialType }
                );
                existingMap.add(key);
                hasChanges = true;
            }
        });
    }

    // 3. Migrate Energy Entries -> Energy Input
    if (dataset.energy_entries && dataset.energy_entries.length > 0) {
        dataset.energy_entries.forEach(entry => {
            const key = `energy_input_type::${entry.id}`;

            if (!existingMap.has(key)) {
                newDataPoints.push(
                    { field_id: 'energy_facility_id', item_id: entry.id, value: entry.facilityId },
                    { field_id: 'energy_input_type', item_id: entry.id, value: entry.source },
                    { field_id: 'energy_input_amount', item_id: entry.id, value: entry.amount.toString() },
                    { field_id: 'energy_input_unit', item_id: entry.id, value: entry.unit }
                );
                existingMap.add(key);
                hasChanges = true;
            }
        });
    }

    if (!hasChanges) {
        return dataset;
    }

    return {
        ...dataset,
        data_points: newDataPoints,
        // We keep the legacy arrays for now to prevent data loss if something goes wrong,
        // but the UI will read from data_points.
    };
}
