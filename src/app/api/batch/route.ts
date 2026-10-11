import { isDeepStrictEqual } from 'node:util';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import {
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
import type { SyncResult } from '@/lib/sync/queue';
import { requireProjectForDataset } from '@/lib/projects/dataset-guards';

const BatchOperationSchema = z.object({
    id: z.string().min(1),
    actorId: z.string().min(1),
    expectedDatasetVersion: z.number().int().min(0),
    type: z.string(),
    payload: z.any(),
});

const BatchRequestSchema = z.object({
    operations: z.array(BatchOperationSchema).min(1).max(500),
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
    fieldIds: z.array(z.string().min(1)).min(1),
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

function applyEntityAddition<T extends { id: string }>(items: T[], value: T, olderReplay: boolean, label: string) {
    const index = items.findIndex(item => item.id === value.id);
    if (index < 0) items.push(value);
    else if (!isDeepStrictEqual(items[index], value)) {
        if (!olderReplay) throw new ApiError(409, 'VERSION_CONFLICT', `This ${label} changed. Review the latest values.`);
        // Reconstruct add + later updates in this temporary copy. An older
        // version can only be acknowledged if the WHOLE final dataset matches;
        // the version check below prevents this copy from ever being written.
        items[index] = value;
    }
}

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
        const results: SyncResult[] = [];
        if (operations.some(op => op.actorId !== user.id)) {
            throw new ApiError(401, 'UNAUTHORIZED', 'Sign in to the account that owns these drafts.');
        }

        // Group dataset updates by project to minimize DB calls
        const datasetUpdatesByProject = new Map<string, Array<{ opId: string; type: string; expectedDatasetVersion: number; payload: any }>>();

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
                        results.push({ id: op.id, success: false, code: 'VALIDATION_ERROR', error: `Unsupported dataset operation: ${op.type}` });
                        continue;
                }

                if (payloadParsed && payloadParsed.success) {
                    projectId = payloadParsed.data.projectId;
                    if (!datasetUpdatesByProject.has(projectId)) {
                        datasetUpdatesByProject.set(projectId, []);
                    }
                    datasetUpdatesByProject.get(projectId)!.push({ opId: op.id, type: op.type, expectedDatasetVersion: op.expectedDatasetVersion, payload: payloadParsed.data });
                } else {
                    results.push({ id: op.id, success: false, code: 'VALIDATION_ERROR', error: `Invalid payload for ${op.type}` });
                }
            } else {
                results.push({ id: op.id, success: false, code: 'VALIDATION_ERROR', error: `Unsupported operation type: ${op.type}` });
            }
        }

        // A project batch uses the version the author saw, never a silently rebased
        // server snapshot. All operations for that project commit in one CAS write.
        for (const [projectId, updates] of datasetUpdatesByProject) {
            try {
                const project = await requireProjectForDataset(user.id, projectId, {
                    includeDataset: true, requireWritable: true, role: OrganizationMembershipRole.EDITOR,
                });
                const currentDataset = structuredClone((project.dataset as Dataset | null) ?? ({ data_points: [] } as Dataset));
                const before = structuredClone(currentDataset);
                const olderReplay = updates.every(update => update.expectedDatasetVersion < project.datasetVersion);
                let dataPoints = currentDataset.data_points ?? [];
                const allFieldIds = updates.flatMap(u => u.type === 'dataset/update-field' ? [u.payload.fieldId] : u.type === 'dataset/add-item' ? u.payload.fieldIds : []);
                const missingFieldIds = await findMissingFieldIds(allFieldIds);
                if (missingFieldIds.length) throw new ApiError(400, 'VALIDATION_ERROR', 'Unknown dataset field IDs');
                    // Apply updates in order
                    updates.forEach(({ type, payload }) => {
                        if (type === 'dataset/update-field') {
                            const { fieldId, itemId, value } = payload;
                            const existingIndex = dataPoints.findIndex(
                                (dp) => dp.field_id === fieldId && (dp.item_id ?? null) === itemId
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
                            for (const fieldId of payload.fieldIds) {
                                if (!dataPoints.some(dp => dp.field_id === fieldId && dp.item_id === payload.itemId)) {
                                    dataPoints.push({ field_id: fieldId, item_id: payload.itemId, value: '' });
                                }
                            }
                        } else if (type === 'dataset/delete-item') {
                            const { itemId } = payload;
                            dataPoints = dataPoints.filter((dp) => dp.item_id !== itemId);
                        }
                        // Corporate - Facilities
                        else if (type === 'dataset/update-facility') {
                            const { facilityId, field, value } = payload;
                            const facilities = (currentDataset.facilities as Facility[]) || [];
                            const index = facilities.findIndex(f => f.id === facilityId);
                            if (index < 0) throw new ApiError(409, 'VERSION_CONFLICT', 'This item was removed. Review the latest values.');
                            if (index >= 0) {
                                facilities[index] = { ...facilities[index], [field]: value };
                                currentDataset.facilities = facilities;
                            }
                        } else if (type === 'dataset/add-facility') {
                            const { facility } = payload;
                            const facilities = (currentDataset.facilities as Facility[]) || [];
                            applyEntityAddition(facilities, facility, olderReplay, 'facility');
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
                            if (index < 0) throw new ApiError(409, 'VERSION_CONFLICT', 'This item was removed. Review the latest values.');
                            if (index >= 0) {
                                entries[index] = { ...entries[index], [field]: value };
                                currentDataset.energy_entries = entries;
                            }
                        } else if (type === 'dataset/add-energy') {
                            const { entry } = payload;
                            const entries = (currentDataset.energy_entries as EnergyEntry[]) || [];
                            applyEntityAddition(entries, entry, olderReplay, 'energy entry');
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
                            if (index < 0) throw new ApiError(409, 'VERSION_CONFLICT', 'This item was removed. Review the latest values.');
                            if (index >= 0) {
                                items[index] = { ...items[index], [field]: value };
                                currentDataset.bom_items = items;
                            }
                        } else if (type === 'dataset/add-bom') {
                            const { item } = payload;
                            const items = (currentDataset.bom_items as BOMItem[]) || [];
                            applyEntityAddition(items, item, olderReplay, 'BOM item');
                            currentDataset.bom_items = items;
                        } else if (type === 'dataset/delete-bom') {
                            const { bomId } = payload;
                            const items = (currentDataset.bom_items as BOMItem[]) || [];
                            currentDataset.bom_items = items.filter(i => i.id !== bomId);
                        }
                    });


                currentDataset.data_points = dataPoints;
                // A lost response can be retried without repeating the write. If a
                // later writer changed the values, normal version conflict applies.
                if (isDeepStrictEqual(currentDataset, before)) {
                    updates.forEach(u => results.push({ id: u.opId, success: true, datasetVersion: project.datasetVersion, writeApplied: false }));
                    continue;
                }
                if (updates.some(u => u.expectedDatasetVersion !== project.datasetVersion)) {
                    throw new ApiError(409, 'VERSION_CONFLICT', 'Dataset changed in another session. Your draft is kept.', { currentVersion: project.datasetVersion });
                }
                const saved = await prisma.project.update({
                    where: { id: projectId, datasetVersion: project.datasetVersion,
                        status: { notIn: ['DELETED', 'REPORTED'] }, organization: { status: { not: 'DELETED' } } },
                    data: { dataset: currentDataset as unknown as Prisma.InputJsonValue, datasetVersion: { increment: 1 } },
                    select: { datasetVersion: true },
                });
                updates.forEach(u => results.push({ id: u.opId, success: true, datasetVersion: saved.datasetVersion, writeApplied: true }));
            } catch (error: unknown) {
                const conflict = error && typeof error === 'object' && 'code' in error && error.code === 'P2025';
                const apiError = conflict
                    ? new ApiError(409, 'VERSION_CONFLICT', 'Dataset changed in another session. Your draft is kept.')
                    : ensureApiError(error, 'Could not save these changes. Please retry.');
                updates.forEach(u => results.push({ id: u.opId, success: false, code: apiError.code,
                    error: apiError.message, currentVersion: apiError.details?.currentVersion as number | undefined }));
            }
        }
        return NextResponse.json({ results });
    } catch (error) {
        return errorResponse(ensureApiError(error, 'Batch processing failed'));
    }
}
