import prisma from '@/lib/db'
import { recomputeUsageSnapshot } from '@/lib/organizations/restore'

const MIN_INTERVAL_MS = Number(process.env.USAGE_SNAPSHOT_MIN_INTERVAL_MS ?? 30_000)
const MAX_STALE_MS = Number(process.env.USAGE_SNAPSHOT_MAX_STALE_MS ?? 5 * 60 * 1000)

async function getLatestSnapshotTimestamp(organizationId: string) {
  const latest = await prisma.organizationUsageSnapshot.findFirst({
    where: { organizationId },
    orderBy: { computedAt: 'desc' },
    select: {
      computedAt: true,
    },
  })

  return latest?.computedAt ?? null
}

function isElapsed(timestamp: Date | null, thresholdMs: number) {
  if (!timestamp) {
    return true
  }

  return Date.now() - timestamp.getTime() >= thresholdMs
}

export async function scheduleUsageRecompute(
  organizationId: string,
  options: { reason?: string; minIntervalMs?: number } = {},
) {
  const minInterval = options.minIntervalMs ?? MIN_INTERVAL_MS
  const latest = await getLatestSnapshotTimestamp(organizationId)

  if (isElapsed(latest, minInterval)) {
    await recomputeUsageSnapshot({ organizationId, skipAuth: true })
    return { snapshotRefreshed: true, reason: options.reason ?? 'event' }
  }

  return { snapshotRefreshed: false, reason: options.reason ?? 'event' }
}

export async function ensureUsageSnapshotFresh(
  organizationId: string,
  options: { reason?: string; maxStaleMs?: number } = {},
) {
  const maxStale = options.maxStaleMs ?? MAX_STALE_MS
  const latest = await getLatestSnapshotTimestamp(organizationId)

  if (isElapsed(latest, maxStale)) {
    await recomputeUsageSnapshot({ organizationId, skipAuth: true })
    return { snapshotRefreshed: true, reason: options.reason ?? 'read' }
  }

  return { snapshotRefreshed: false, reason: options.reason ?? 'read' }
}
