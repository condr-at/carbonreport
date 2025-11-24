import { useSyncExternalStore } from 'react'

const previewStore = new Map<string, string>()
const subscribers = new Set<() => void>()

function emit() {
  subscribers.forEach((listener) => {
    try {
      listener()
    } catch {
      // ignore listener errors
    }
  })
}

function subscribe(listener: () => void) {
  subscribers.add(listener)
  return () => {
    subscribers.delete(listener)
  }
}

export function cachePendingAssetPreview(key: string | null | undefined, dataUrl: string | null | undefined) {
  if (!key || !dataUrl) {
    return
  }
  previewStore.set(key, dataUrl)
  emit()
}

export function clearPendingAssetPreview(key: string | null | undefined) {
  if (!key) {
    return
  }
  if (previewStore.delete(key)) {
    emit()
  }
}

export function clearPendingAssetPreviews(keys: Array<string | null | undefined>) {
  keys.forEach((key) => {
    clearPendingAssetPreview(key)
  })
}

export function getPendingAssetPreview(key: string | null | undefined) {
  if (!key) {
    return null
  }
  return previewStore.get(key) ?? null
}

export function usePendingAssetPreview(key: string | null | undefined) {
  return useSyncExternalStore(subscribe, () => getPendingAssetPreview(key), () => null)
}
