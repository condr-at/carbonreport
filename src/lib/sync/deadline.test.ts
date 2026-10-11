import assert from 'node:assert/strict';
import test from 'node:test';
import { withDeadline } from './deadline';

test('a stalled request or session renewal cannot hold saving forever', async () => {
  let aborted = false;
  await assert.rejects(withDeadline(signal => new Promise<never>(() => {
    signal.addEventListener('abort', () => { aborted = true; });
  }), 5), /Saving timed out.*draft is kept/);
  assert.equal(aborted, true);
});

test('an acknowledged result completes without being replaced by a timeout', async () => {
  assert.equal(await withDeadline(async () => 'saved', 100), 'saved');
});
