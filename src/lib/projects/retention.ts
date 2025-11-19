const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const PROJECT_RETENTION_DAYS = 30;

export type ProjectRetentionSummary = {
  expires_at: Date;
  days_remaining: number;
};

export type ProjectRetentionCountdown = ProjectRetentionSummary & {
  deleted_at: Date;
  days_since_deletion: number;
};

export function computeProjectRetention(deletedAt: Date | null): ProjectRetentionSummary | null {
  if (!deletedAt) {
    return null;
  }

  const expiresAt = new Date(deletedAt.getTime() + PROJECT_RETENTION_DAYS * DAY_IN_MS);
  const now = Date.now();
  const remainingMs = Math.max(0, expiresAt.getTime() - now);
  const daysRemaining = Math.ceil(remainingMs / DAY_IN_MS);

  return {
    expires_at: expiresAt,
    days_remaining: daysRemaining,
  };
}

export function getProjectRetentionCountdown(
  deletedAtInput: Date | string | null,
): ProjectRetentionCountdown | null {
  if (!deletedAtInput) {
    return null;
  }

  const deletedAt = deletedAtInput instanceof Date ? deletedAtInput : new Date(deletedAtInput);

  if (Number.isNaN(deletedAt.getTime())) {
    return null;
  }

  const retention = computeProjectRetention(deletedAt);

  if (!retention) {
    return null;
  }

  const elapsedMs = Math.max(0, Date.now() - deletedAt.getTime());
  const daysSinceDeletion = Math.ceil(elapsedMs / DAY_IN_MS);

  return {
    deleted_at: deletedAt,
    days_since_deletion: daysSinceDeletion,
    expires_at: retention.expires_at,
    days_remaining: retention.days_remaining,
  };
}
