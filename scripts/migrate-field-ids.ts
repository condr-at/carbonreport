/**
 * Migration script: normalize field IDs (remove prefixes, snake_case)
 * - Updates DatasetFieldDefinition.fieldId
 * - Updates Project.dataset JSONB data_points[].field_id
 *
 * Safe to run multiple times (idempotent):
 * - Skips if fieldId already normalized
 */
import { PrismaClient } from '@prisma/client'
import { DATASET_FIELD_SEED } from '../prisma/seed-data/dataset-fields'

type DataPoint = {
  field_id: string
  item_id: string | null
  value: string
}

type DatasetPayload = {
  data_points: DataPoint[]
}

const prisma = new PrismaClient()

const NEW_FIELD_BY_ID = new Map(DATASET_FIELD_SEED.map((field) => [field.fieldId, field]))
const LEGACY_TO_NEW = new Map<string, string>()

for (const seed of DATASET_FIELD_SEED) {
  if (!seed.legacyFieldIds) continue
  for (const legacy of seed.legacyFieldIds) {
    LEGACY_TO_NEW.set(legacy, seed.fieldId)
  }
}

function normalizeDataPoints(dataPoints: any[]): { normalized: DataPoint[]; changed: boolean } {
  if (!Array.isArray(dataPoints)) {
    return { normalized: [], changed: false }
  }

  const deduped = new Map<string, DataPoint>()
  let changed = false

  for (const raw of dataPoints) {
    if (!raw || typeof raw.field_id !== 'string') continue

    const nextFieldId = LEGACY_TO_NEW.get(raw.field_id) ?? raw.field_id
    const nextItemId = raw.item_id === '' ? null : raw.item_id ?? null
    const nextValue = typeof raw.value === 'string' ? raw.value : raw.value?.toString?.() ?? ''

    if (nextFieldId !== raw.field_id || nextItemId !== raw.item_id || nextValue !== raw.value) {
      changed = true
    }

    const key = `${nextFieldId}::${nextItemId ?? 'null'}`
    const existing = deduped.get(key)
    if (!existing) {
      deduped.set(key, { field_id: nextFieldId, item_id: nextItemId, value: nextValue })
    } else if (!existing.value && nextValue) {
      existing.value = nextValue
      changed = true
    }
  }

  return { normalized: Array.from(deduped.values()), changed }
}

async function upsertFieldDefinitions() {
  for (const seed of DATASET_FIELD_SEED) {
    await prisma.datasetFieldDefinition.upsert({
      where: { fieldId: seed.fieldId },
      update: {
        label: seed.label,
        hint: seed.hint ?? null,
        type: seed.type ?? 'text',
        options: seed.options ?? null,
        validation: seed.validation ?? null,
        isRepeatable: seed.isRepeatable ?? false,
        repeatableKey: seed.repeatableKey ?? null,
        sortOrder: seed.sortOrder,
      },
      create: {
        fieldId: seed.fieldId,
        label: seed.label,
        hint: seed.hint ?? null,
        type: seed.type ?? 'text',
        options: seed.options ?? null,
        validation: seed.validation ?? null,
        isRepeatable: seed.isRepeatable ?? false,
        repeatableKey: seed.repeatableKey ?? null,
        sortOrder: seed.sortOrder,
      },
    })
  }
}

async function migrateFieldDefinitions() {
  const legacyIds = Array.from(LEGACY_TO_NEW.keys())
  if (legacyIds.length === 0) return

  const legacyDefs = await prisma.datasetFieldDefinition.findMany({
    where: { fieldId: { in: legacyIds } },
  })

  for (const def of legacyDefs) {
    const nextId = LEGACY_TO_NEW.get(def.fieldId)
    if (!nextId) continue

    const seed = NEW_FIELD_BY_ID.get(nextId)
    if (!seed) continue

    await prisma.datasetFieldDefinition.update({
      where: { id: def.id },
      data: {
        fieldId: nextId,
        label: seed.label,
        hint: seed.hint ?? null,
        type: seed.type ?? 'text',
        options: seed.options ?? null,
        validation: seed.validation ?? null,
        isRepeatable: seed.isRepeatable ?? false,
        repeatableKey: seed.repeatableKey ?? null,
        sortOrder: seed.sortOrder,
      },
    })
  }
}

async function migrateProjects() {
  const projects = await prisma.project.findMany()

  for (const project of projects) {
    let changed = false

    const dataset = project.dataset as DatasetPayload | null
    let nextDataset: DatasetPayload | null = dataset

    if (dataset && Array.isArray(dataset.data_points)) {
      const { normalized, changed: datasetChanged } = normalizeDataPoints(dataset.data_points)
      if (datasetChanged) {
        nextDataset = { data_points: normalized }
        changed = true
      }
    }

    let nextMailto = project.mailtoTemplates as Record<string, string> | null
    if (nextMailto && typeof nextMailto === 'object') {
      const updatedMailto: Record<string, string> = {}
      let mailChanged = false
      for (const [key, template] of Object.entries(nextMailto)) {
        const newKey = LEGACY_TO_NEW.get(key) ?? key
        if (newKey !== key) mailChanged = true
        updatedMailto[newKey] = template
      }
      if (mailChanged) {
        nextMailto = updatedMailto
        changed = true
      }
    }

    if (!changed) continue

    await prisma.project.update({
      where: { id: project.id },
      data: {
        dataset: nextDataset ?? undefined,
        mailtoTemplates: nextMailto ?? undefined,
        datasetVersion: { increment: 1 },
      },
    })

    console.log(`✅ Project updated: ${project.name}`)
  }
}

async function migrateDataRequests() {
  const requests = await prisma.dataRequest.findMany({
    where: { dataPointId: { in: Array.from(LEGACY_TO_NEW.keys()) } },
  })

  for (const request of requests) {
    const newId = LEGACY_TO_NEW.get(request.dataPointId)
    if (!newId) continue

    await prisma.dataRequest.update({
      where: { id: request.id },
      data: { dataPointId: newId },
    })
    console.log(`🔄 Data request updated: ${request.id}`)
  }
}

async function cleanupLegacyDefinitions() {
  const legacyIds = Array.from(LEGACY_TO_NEW.keys())
  if (legacyIds.length === 0) return

  await prisma.datasetFieldDefinition.deleteMany({
    where: { fieldId: { in: legacyIds } },
  })
}

async function main() {
  console.log('🔧 Running field ID migration...')

  if (LEGACY_TO_NEW.size === 0) {
    console.log('✅ No legacy field IDs configured. Nothing to do.')
    return
  }

  await upsertFieldDefinitions()
  await migrateProjects()
  await migrateDataRequests()
  await migrateFieldDefinitions()
  await cleanupLegacyDefinitions()

  console.log('🎉 Migration complete!')
}

main()
  .catch((error) => {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
