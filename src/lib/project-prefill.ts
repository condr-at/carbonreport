export type ProjectPrefillSource = 'projects-list' | 'project-create' | 'server';

export interface ProjectPrefill {
  id: string;
  name: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  reportsCount?: number;
  completion?: number;
  templateCodes?: string[];
  datasetVersion?: number;
  source?: ProjectPrefillSource;
  timestamp: number;
}

const STORAGE_KEY = 'project-prefill-cache';

type PrefillMap = Record<string, ProjectPrefill>;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
}

function readCache(): PrefillMap {
  if (!isBrowser()) return {};

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as PrefillMap;
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (error) {
    console.warn('[project-prefill] Failed to parse cache', error);
  }

  return {};
}

function writeCache(cache: PrefillMap) {
  if (!isBrowser()) return;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('[project-prefill] Failed to write cache', error);
  }
}

function mergePrefill(existing: ProjectPrefill | undefined, incoming: ProjectPrefill): ProjectPrefill {
  return {
    ...existing,
    ...incoming,
    timestamp: incoming.timestamp ?? Date.now(),
  };
}

export function saveProjectPrefill(prefill: Omit<ProjectPrefill, 'timestamp'> & Partial<Pick<ProjectPrefill, 'timestamp'>>) {
  if (!isBrowser()) return;
  if (!prefill?.id) return;

  const cache = readCache();
  const current = cache[prefill.id];
  const next = mergePrefill(current, {
    ...prefill,
    timestamp: prefill.timestamp ?? Date.now(),
  });
  cache[prefill.id] = next;
  writeCache(cache);
}

export function getProjectPrefill(id: string): ProjectPrefill | null {
  if (!isBrowser()) return null;
  if (!id) return null;

  const cache = readCache();
  return cache[id] ?? null;
}

export function clearProjectPrefill(id: string) {
  if (!isBrowser()) return;
  if (!id) return;

  const cache = readCache();
  if (cache[id]) {
    delete cache[id];
    writeCache(cache);
  }
}

export function clearProjectPrefillCache() {
  if (!isBrowser()) return;
  sessionStorage.removeItem(STORAGE_KEY);
}
