import { headers } from 'next/headers';
import { performance } from 'node:perf_hooks';

const HEADER_NAME = 'x-server-timing';
const TOKEN_SANITIZE_REGEX = /[^A-Za-z0-9_-]/g;
const QUOTE_REGEX = /"/g;

export interface ServerTimingEntry {
  label: string;
  durationMs: number;
  description?: string;
}

export interface PayloadMetric {
  label: string;
  bytes: number;
}

export class ServerTimingTracker {
  private readonly entries: ServerTimingEntry[] = [];
  private readonly payloads: PayloadMetric[] = [];
  private readonly prefix?: string;
  private headerAttachFailed = false;

  constructor(prefix?: string) {
    this.prefix = prefix;
  }

  start(label: string, description?: string): (finalDescription?: string) => void {
    const sanitizedLabel = sanitizeToken(label);
    const startMark = performance.now();
    return (finalDescription?: string) => {
      const finish = performance.now();
      this.entries.push({
        label: sanitizedLabel,
        durationMs: finish - startMark,
        description: finalDescription ?? description,
      });
    };
  }

  async time<T>(label: string, fn: () => Promise<T>, description?: string): Promise<T> {
    const stop = this.start(label, description);
    try {
      const result = await fn();
      stop();
      return result;
    } catch (error) {
      stop();
      throw error;
    }
  }

  recordPayload(label: string, payload: unknown): number {
    const bytes = estimatePayloadSize(payload);
    this.payloads.push({ label, bytes });
    return bytes;
  }

  async commit(): Promise<void> {
    // In Next.js App Router, headers() returns a read-only interface to request headers.
    // We cannot set response headers here.
    // Timings are still logged to the console via logTimings().
    return Promise.resolve();
  }

  logTimings(label?: string): void {
    if (this.entries.length === 0) {
      return;
    }

    const scope = label ?? this.prefix ?? 'server-timing';
    const summary = this.entries
      .slice()
      .sort((a, b) => b.durationMs - a.durationMs)
      .map((entry) => ({
        metric: entry.label,
        durationMs: Number(entry.durationMs.toFixed(2)),
        ...(entry.description ? { description: entry.description } : {}),
      }));

    console.info(`[${scope}] timings`, summary);
  }

  logPayloads(label?: string): void {
    if (this.payloads.length === 0) {
      return;
    }

    const scope = label ?? this.prefix ?? 'payload';
    const summary = this.payloads
      .slice()
      .sort((a, b) => b.bytes - a.bytes)
      .map((payload) => ({
        metric: payload.label,
        bytes: payload.bytes,
        formatted: formatBytes(payload.bytes),
      }));

    const totalBytes = this.payloads.reduce((sum, payload) => sum + payload.bytes, 0);

    console.info(`[${scope}] payloads`, {
      totalBytes,
      formattedTotal: formatBytes(totalBytes),
      breakdown: summary,
    });
  }

  getEntries(): ServerTimingEntry[] {
    return [...this.entries];
  }

  getPayloads(): PayloadMetric[] {
    return [...this.payloads];
  }

  getHeaderValue(): string | null {
    if (this.entries.length === 0) {
      return null;
    }

    return this.entries.map(formatHeaderEntry).join(', ');
  }
}

export function createServerTimingTracker(prefix?: string): ServerTimingTracker {
  return new ServerTimingTracker(prefix);
}

export function estimatePayloadSize(payload: unknown): number {
  try {
    const json = JSON.stringify(payload);
    if (typeof json !== 'string') {
      return 0;
    }

    return Buffer.byteLength(json, 'utf8');
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[server-timing] payload size estimation failed', error);
    }
    return 0;
  }
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) {
    return '0kb';
  }

  return `${(bytes / 1024).toFixed(2)}kb`;
}

function sanitizeToken(label: string): string {
  return label.replace(TOKEN_SANITIZE_REGEX, '-');
}

function sanitizeDescription(description: string): string {
  return description.replace(QUOTE_REGEX, '\'');
}

function formatHeaderEntry(entry: ServerTimingEntry): string {
  const duration = entry.durationMs >= 0 ? entry.durationMs.toFixed(2) : '0';
  if (!entry.description) {
    return `${entry.label};dur=${duration}`;
  }

  const desc = sanitizeDescription(entry.description);
  return `${entry.label};dur=${duration};desc="${desc}"`;
}
