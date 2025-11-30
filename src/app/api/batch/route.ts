import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { validateDataset, type Dataset, type DataPoint } from '@/lib/dataset-validation';
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
            if (op.type === 'dataset/update-field' || op.type === 'dataset/add-item' || op.type === 'dataset/delete-item') {
                let projectId = '';
                let payloadParsed;

                if (op.type === 'dataset/update-field') {
                    payloadParsed = UpdateFieldPayloadSchema.safeParse(op.payload);
                } else if (op.type === 'dataset/add-item') {
                    payloadParsed = AddItemPayloadSchema.safeParse(op.payload);
                } else if (op.type === 'dataset/delete-item') {
                    payloadParsed = DeleteItemPayloadSchema.safeParse(op.payload);
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
            try {
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
                const missingFieldIds = await findMissingFieldIds(allFieldIds);

                if (missingFieldIds.length > 0) {
                    // Fail all updates for this project if any field is invalid (or fail individually? failing all is safer for batch consistency)
                    updates.forEach(u => {
                        results.push({ id: u.opId, success: false, error: `Unknown field IDs: ${missingFieldIds.join(', ')}` });
                    });
                    continue;
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
                        const { repeatableKey, itemId } = payload;
                        // We don't need to do anything here because 'add-item' just establishes the ID.
                        // The actual data points are added via 'update-field'.
                        // However, if we want to ensure the item exists even without data points, we might need a placeholder?
                        // Current logic: Data points define the item.
                        // If we add an item, we usually want to pre-fill some defaults or just allow 'update-field' to create it.
                        // BUT, the UI expects an item to exist.
                        // In this data model, an "item" is just a collection of data points with the same item_id.
                        // So strictly speaking, we don't need to "create" it.
                        // But we might want to validate that the ID is unique?
                        // For now, we trust the client generated ID.
                    } else if (type === 'dataset/delete-item') {
                        const { itemId } = payload;
                        dataPoints = dataPoints.filter((dp) => dp.item_id !== itemId);
                    }
                });

                // Save to DB
                await prisma.project.update({
                    where: {
                        id: projectId,
                        datasetVersion: project.datasetVersion, // Optimistic locking
                    },
                    data: {
                        dataset: { data_points: dataPoints } as unknown as Prisma.InputJsonValue,
                        datasetVersion: { increment: 1 },
                    },
                });

                // Mark all as success
                updates.forEach(u => {
                    results.push({ id: u.opId, success: true });
                });

            } catch (error) {
                console.error(`Failed to process batch for project ${projectId}`, error);
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                updates.forEach(u => {
                    results.push({ id: u.opId, success: false, error: errorMessage });
                });
            }
        }

        return NextResponse.json({ results });

    } catch (error) {
        return errorResponse(ensureApiError(error, 'Batch processing failed'));
    }
}
