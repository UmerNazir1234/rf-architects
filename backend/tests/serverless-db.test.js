import test from 'node:test';
import assert from 'node:assert/strict';
import { getMongoUriCandidates } from '../src/config/db.js';

test('vercel runtime skips localhost fallback and keeps configured production URI only', () => {
  process.env.MONGO_URI = 'mongodb+srv://example.test/db';
  process.env.VERCEL = '1';
  process.env.NODE_ENV = 'production';

  assert.deepEqual(getMongoUriCandidates(), [
    'mongodb+srv://example.test/db',
  ]);

  delete process.env.VERCEL;
});
