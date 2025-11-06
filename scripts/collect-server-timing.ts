#!/usr/bin/env tsx
import { performance } from 'node:perf_hooks';

interface MetricsSnapshot {
  url: string;
  status: number;
  durationMs: number;
  serverTiming: string | null;
  payloadBytes: number;
  payloadFormatted: string;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) {
    return '0kb';
  }

  return `${(bytes / 1024).toFixed(2)}kb`;
}

async function fetchMetrics(url: string): Promise<MetricsSnapshot> {
  const start = performance.now();
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'carbonreport-metrics/1.0',
    },
    redirect: 'follow',
  });
  const durationMs = performance.now() - start;
  const body = await response.text();
  const payloadBytes = Buffer.byteLength(body, 'utf8');

  return {
    url,
    status: response.status,
    durationMs: Number(durationMs.toFixed(2)),
    serverTiming: response.headers.get('x-server-timing'),
    payloadBytes,
    payloadFormatted: formatBytes(payloadBytes),
  };
}

async function main(): Promise<void> {
  const [, , targetUrl] = process.argv;

  if (!targetUrl) {
    console.error('Usage: npm run metrics:collect -- <url>');
    process.exitCode = 1;
    return;
  }

  try {
    const metrics = await fetchMetrics(targetUrl);
    console.log(JSON.stringify(metrics, null, 2));
  } catch (error) {
    console.error('Failed to collect metrics', error);
    process.exitCode = 1;
  }
}

void main();
