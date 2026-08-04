import test from 'node:test';
import assert from 'node:assert/strict';
import { getMongoUriCandidates } from '../src/config/db.js';

test('returns configured URI first and local fallback second', () => {
  process.env.MONGO_URI = 'mongodb+srv://example.test/db';

  assert.deepEqual(getMongoUriCandidates(), [
    'mongodb+srv://example.test/db',
    'mongodb://127.0.0.1:27017/rf-architects',
  ]);
});

test('uses local URI when no configured URI is present', () => {
  delete process.env.MONGO_URI;

  assert.deepEqual(getMongoUriCandidates(), [
    'mongodb://127.0.0.1:27017/rf-architects',
  ]);
});
