type CacheEntry = {
  value: unknown;
  expiresAt: number;
};

const store = new Map<string, CacheEntry>();

const DEFAULT_TTL_MS = 30_000;

export function getCacheValue<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    store.delete(key);
    return null;
  }

  return entry.value as T;
}

export function setCacheValue<T>(key: string, value: T, ttlMs: number = DEFAULT_TTL_MS): void {
  store.set(key, {
    value,
    expiresAt: Date.now() + Math.max(ttlMs, 1_000),
  });
}

export function invalidateCache(key: string): void {
  store.delete(key);
}

export function invalidateByPrefix(prefix: string): void {
  for (const cacheKey of store.keys()) {
    if (cacheKey.startsWith(prefix)) {
      store.delete(cacheKey);
    }
  }
}

export function clearCache(): void {
  store.clear();
}
