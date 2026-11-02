import test from 'node:test';
import assert from 'node:assert/strict';
import { detectImageType } from '../src/utils/imageValidation.js';

test('recognizes JPEG signature', () => {
  assert.equal(detectImageType(Buffer.from([0xff, 0xd8, 0xff, 0x00])), 'image/jpeg');
});
test('recognizes PNG signature', () => {
  assert.equal(detectImageType(Buffer.from([137,80,78,71,13,10,26,10])), 'image/png');
});
test('recognizes WebP signature', () => {
  const b = Buffer.alloc(12); b.write('RIFF', 0); b.write('WEBP', 8);
  assert.equal(detectImageType(b), 'image/webp');
});
test('rejects unknown, short and non-buffer content', () => {
  assert.equal(detectImageType(Buffer.from('not an image')), null);
  assert.equal(detectImageType(Buffer.from([0xff, 0xd8])), null);
  assert.equal(detectImageType('image/jpeg'), null);
});
