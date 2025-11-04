const ENABLE_LOGGING = process.env.NEXT_PUBLIC_OPTIMISTIC_DEBUG === 'true';

type Lifecycle = 'mutate:start' | 'mutate:error' | 'mutate:success' | 'mutate:settled';

type LogPayload = Record<string, unknown> | undefined;

export function logOptimistic(event: Lifecycle, payload?: LogPayload): void {
  if (!ENABLE_LOGGING) {
    return;
  }

  const time = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.debug(`[optimistic:${event}]`, time, payload ?? {});
}
