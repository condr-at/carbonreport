import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import {
    validateDataset,
    type Dataset,
    type DataPoint,
    FacilitySchema,
    EnergyEntrySchema,
    BOMItemSchema,
    type Facility,
    type EnergyEntry,
    type BOMItem
} from '@/lib/dataset-validation';
import { getCurrentUser } from '@/lib/auth';
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error';
import { OrganizationMembershipRole, type Prisma } from '@prisma/client';
import { requireProjectForDataset } from '@/lib/projects/dataset-guards';

const BatchOperationSchema = z.object({
    id: z.string(),
    type: z.string(),
    payload: z.any(),
});

const BatchRequestSchema = z.object({
    operations: z.array(BatchOperationSchema),
});

const UpdateFieldPayloadSchema = z.object({
    projectId: z.string(),
    fieldId: z.string().min(1),
    itemId: z.string().nullable(),
    value: z.string(),
});

async function findMissingFieldIds(fieldIds: string[]): Promise<string[]> {
    if (!fieldIds.length) {
        return [];
    }

    const uniqueIds = Array.from(new Set(fieldIds.filter((id) => id && id.trim().length > 0)));
    if (!uniqueIds.length) {
        return [];
    }

    const definitions = await prisma.datasetFieldDefinition.findMany({
        where: { fieldId: { in: uniqueIds } },
        select: { fieldId: true },
    });

    const known = new Set(definitions.map((definition) => definition.fieldId));
    return uniqueIds.filter((id) => !known.has(id));
}

const AddItemPayloadSchema = z.object({
    projectId: z.string(),
    repeatableKey: z.string(),
    itemId: z.string(), // Client-generated ID
});

const DeleteItemPayloadSchema = z.object({
    projectId: z.string(),
    itemId: z.string(),
});

// --- Corporate / Product Payloads ---

const UpdateFacilityPayloadSchema = z.object({
    projectId: z.string(),
    facilityId: z.string(),
    field: z.enum(['name', 'address', 'country']),
    value: z.string(),
});

const AddFacilityPayloadSchema = z.object({
    projectId: z.string(),
    facility: FacilitySchema,
});

const DeleteFacilityPayloadSchema = z.object({
    projectId: z.string(),
    facilityId: z.string(),
});

const UpdateEnergyPayloadSchema = z.object({
    projectId: z.string(),
    energyId: z.string(),
    field: z.enum(['facilityId', 'source', 'amount', 'unit']),
    value: z.union([z.string(), z.number()]),
});

const AddEnergyPayloadSchema = z.object({
    projectId: z.string(),
    entry: EnergyEntrySchema,
});

const DeleteEnergyPayloadSchema = z.object({
    projectId: z.string(),
    energyId: z.string(),
});

const UpdateBOMPayloadSchema = z.object({
    projectId: z.string(),
    bomId: z.string(),
    field: z.enum(['name', 'weight', 'origin', 'materialType']),
    value: z.union([z.string(), z.number()]),
});

const AddBOMPayloadSchema = z.object({
    projectId: z.string(),
    item: BOMItemSchema,
});

const DeleteBOMPayloadSchema = z.object({
    projectId: z.string(),
    bomId: z.string(),
});

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        const body = await request.json().catch(() => ({}));
        const parsed = BatchRequestSchema.safeParse(body);

        if (!parsed.success) {
            return errorResponse(
                new ApiError(400, 'VALIDATION_ERROR', 'Invalid batch payload', {
                    issues: parsed.error.flatten(),
                })
            );
        }

        const operations = parsed.data.operations;
        const results: Array<{ id: string; success: boolean; error?: string }> = [];

        // Group dataset updates by project to minimize DB calls
        const datasetUpdatesByProject = new Map<string, Array<{ opId: string; type: string; payload: any }>>();

        for (const op of operations) {
            if (op.type.startsWith('dataset/')) {
                let projectId = '';
                let payloadParsed;

                switch (op.type) {
                    case 'dataset/update-field':
                        payloadParsed = UpdateFieldPayloadSchema.safeParse(op.payload);
                        break;
                    case 'dataset/add-item':
                        payloadParsed = AddItemPayloadSchema.safeParse(op.payload);
                        break;
                    case 'dataset/delete-item':
                        payloadParsed = DeleteItemPayloadSchema.safeParse(op.payload);
                        break;
                    // Corporate
                    case 'dataset/update-facility':
                        payloadParsed = UpdateFacilityPayloadSchema.safeParse(op.payload);
                        break;
                    case 'dataset/add-facility':
                        payloadParsed = AddFacilityPayloadSchema.safeParse(op.payload);
                        break;
                    case 'dataset/delete-facility':
                        payloadParsed = DeleteFacilityPayloadSchema.safeParse(op.payload);
                        break;
                    case 'dataset/update-energy':
                        payloadParsed = UpdateEnergyPayloadSchema.safeParse(op.payload);
                        break;
                    case 'dataset/add-energy':
                        payloadParsed = AddEnergyPayloadSchema.safeParse(op.payload);
                        break;
                    case 'dataset/delete-energy':
                        payloadParsed = DeleteEnergyPayloadSchema.safeParse(op.payload);
                        break;
                    // Product
                    case 'dataset/update-bom':
                        payloadParsed = UpdateBOMPayloadSchema.safeParse(op.payload);
                        break;
                    case 'dataset/add-bom':
                        payloadParsed = AddBOMPayloadSchema.safeParse(op.payload);
                        break;
                    case 'dataset/delete-bom':
                        payloadParsed = DeleteBOMPayloadSchema.safeParse(op.payload);
                        break;
                    default:
                        results.push({ id: op.id, success: false, error: `Unsupported dataset operation: ${op.type}` });
                        continue;
                }

                if (payloadParsed && payloadParsed.success) {
                    projectId = payloadParsed.data.projectId;
                    if (!datasetUpdatesByProject.has(projectId)) {
                        datasetUpdatesByProject.set(projectId, []);
                    }
                    datasetUpdatesByProject.get(projectId)!.push({ opId: op.id, type: op.type, payload: payloadParsed.data });
                } else {
                    results.push({ id: op.id, success: false, error: `Invalid payload for ${op.type}` });
                }
            } else {
                results.push({ id: op.id, success: false, error: `Unsupported operation type: ${op.type}` });
            }
        }

        // Process dataset updates per project
        for (const [projectId, updates] of datasetUpdatesByProject) {
            let retries = 0;
            const MAX_RETRIES = 3;
            let success = false;

            while (retries < MAX_RETRIES && !success) {
                try {
                    // 1. Read LATEST version and data
                    const project = await requireProjectForDataset(user.id, projectId, {
                        includeDataset: true,
                        requireWritable: true,
                        role: OrganizationMembershipRole.EDITOR,
                    });

                    const currentDataset = (project.dataset as Dataset | null) ?? ({ data_points: [] } as Dataset);
                    let dataPoints = currentDataset.data_points ?? [];

                    // Collect all field IDs to validate (only for update-field)
                    const updatesWithFields = updates.filter(u => u.type === 'dataset/update-field');
                    const allFieldIds = updatesWithFields.map(u => u.payload.fieldId);
                    // We only need to check missing fields once, not on every retry, but it's cheap enough
                    const missingFieldIds = await findMissingFieldIds(allFieldIds);

                    if (missingFieldIds.length > 0) {
                        // Fail all updates for this project if any field is invalid
                        updates.forEach(u => {
                            results.push({ id: u.opId, success: false, error: `Unknown field IDs: ${missingFieldIds.join(', ')}` });
                        });
                        success = true; // "Success" in processing, even if operations failed
                        break;
                    }

                    // Apply updates in order
                    updates.forEach(({ type, payload }) => {
                        if (type === 'dataset/update-field') {
                            const { fieldId, itemId, value } = payload;
                            const existingIndex = dataPoints.findIndex(
                                (dp) => dp.field_id === fieldId && (itemId === null ? dp.item_id === null : dp.item_id === itemId)
                            );

                            const updatedDataPoint: DataPoint = {
                                field_id: fieldId,
                                item_id: itemId,
                                value,
                            };

                            if (existingIndex >= 0) {
                                dataPoints[existingIndex] = updatedDataPoint;
                            } else {
                                dataPoints.push(updatedDataPoint);
                            }
                        } else if (type === 'dataset/add-item') {
                            // No-op for data structure
                        } else if (type === 'dataset/delete-item') {
                            const { itemId } = payload;
                            dataPoints = dataPoints.filter((dp) => dp.item_id !== itemId);
                        }
                        // Corporate - Facilities
                        else if (type === 'dataset/update-facility') {
                            const { facilityId, field, value } = payload;
                            const facilities = (currentDataset.facilities as Facility[]) || [];
                            const index = facilities.findIndex(f => f.id === facilityId);
                            if (index >= 0) {
                                facilities[index] = { ...facilities[index], [field]: value };
                                currentDataset.facilities = facilities;
                            }
                        } else if (type === 'dataset/add-facility') {
                            const { facility } = payload;
                            const facilities = (currentDataset.facilities as Facility[]) || [];
                            facilities.push(facility);
                            currentDataset.facilities = facilities;
                        } else if (type === 'dataset/delete-facility') {
                            const { facilityId } = payload;
                            const facilities = (currentDataset.facilities as Facility[]) || [];
                            currentDataset.facilities = facilities.filter(f => f.id !== facilityId);
                        }
                        // Corporate - Energy
                        else if (type === 'dataset/update-energy') {
                            const { energyId, field, value } = payload;
                            const entries = (currentDataset.energy_entries as EnergyEntry[]) || [];
                            const index = entries.findIndex(e => e.id === energyId);
                            if (index >= 0) {
                                entries[index] = { ...entries[index], [field]: value };
                                currentDataset.energy_entries = entries;
                            }
                        } else if (type === 'dataset/add-energy') {
                            const { entry } = payload;
                            const entries = (currentDataset.energy_entries as EnergyEntry[]) || [];
                            entries.push(entry);
                            currentDataset.energy_entries = entries;
                        } else if (type === 'dataset/delete-energy') {
                            const { energyId } = payload;
                            const entries = (currentDataset.energy_entries as EnergyEntry[]) || [];
                            currentDataset.energy_entries = entries.filter(e => e.id !== energyId);
                        }
                        // Product - BOM
                        else if (type === 'dataset/update-bom') {
                            const { bomId, field, value } = payload;
                            const items = (currentDataset.bom_items as BOMItem[]) || [];
                            const index = items.findIndex(i => i.id === bomId);
                            if (index >= 0) {
                                items[index] = { ...items[index], [field]: value };
                                currentDataset.bom_items = items;
                            }
                        } else if (type === 'dataset/add-bom') {
                            const { item } = payload;
                            const items = (currentDataset.bom_items as BOMItem[]) || [];
                            items.push(item);
                            currentDataset.bom_items = items;
                        } else if (type === 'dataset/delete-bom') {
                            const { bomId } = payload;
                            const items = (currentDataset.bom_items as BOMItem[]) || [];
                            currentDataset.bom_items = items.filter(i => i.id !== bomId);
                        }
                    });

                    // Update data_points in the main object before saving
                    currentDataset.data_points = dataPoints;

                    // Save to DB
                    await prisma.project.update({
                        where: {
                            id: projectId,
                            datasetVersion: project.datasetVersion, // Optimistic locking
                        },
                        data: {
                            dataset: currentDataset as unknown as Prisma.InputJsonValue,
                            datasetVersion: { increment: 1 },
                        },
                    });

                    // Mark all as success
                    updates.forEach(u => {
                        results.push({ id: u.opId, success: true });
                    });
                    success = true;

                } catch (error: any) {
                    if (error?.code === 'P2025') {
                        // Version conflict: retry
                        retries++;
                        console.warn(`Version conflict for project ${projectId}, retrying (${retries}/${MAX_RETRIES})...`);
                        if (retries >= MAX_RETRIES) {
                            console.error(`Max retries reached for project ${projectId}`);
                            updates.forEach(u => {
                                results.push({
                                    id: u.opId,
                                    success: false,
                                    error: 'VERSION_CONFLICT_MAX_RETRIES'
                                });
                            });
                            success = true; // Stop retrying
                        }
                        // Loop will retry
                    } else {
                        // Other error: fail immediately
                        console.error(`Failed to process batch for project ${projectId}`, error);
                        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                        updates.forEach(u => {
                            results.push({ id: u.opId, success: false, error: errorMessage });
                        });
                        success = true; // Stop retrying
                    }
                }
            }
        }

        return NextResponse.json({ results });

    } catch (error) {
        return errorResponse(ensureApiError(error, 'Batch processing failed'));
    }
}
