import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeInsights } from '../src/utils/normalizeInsights.js';

test('normalizes complete Gemini care output without changing useful values', () => {
  const result = normalizeInsights({ overview: 'A tropical plant.', watering: { frequency: 'Weekly' }, facts: ['Fact one'] });
  assert.equal(result.overview, 'A tropical plant.');
  assert.equal(result.watering.frequency, 'Weekly');
  assert.deepEqual(result.facts, ['Fact one']);
  assert.deepEqual(result.diseases, []);
});

test('fills required overview and optional structures when Gemini omits fields', () => {
  const result = normalizeInsights({});
  assert.ok(result.overview.length > 0);
  assert.deepEqual(result.watering, { frequency: '', instructions: '', signsOfOverwatering: '' });
  assert.deepEqual(result.propagation, { methods: [], instructions: '' });
  assert.deepEqual(result.facts, []);
});

test('drops malformed list entries instead of passing invalid types to Mongoose', () => {
  const result = normalizeInsights({ diseases: [null, 'bad', { name: 'Mildew', symptoms: 42 }], facts: ['Valid', 42], propagation: { methods: ['Cuttings', null, 5] } });
  assert.deepEqual(result.diseases, [{ name: 'Mildew', symptoms: '', treatment: '' }]);
  assert.deepEqual(result.facts, ['Valid']);
  assert.deepEqual(result.propagation.methods, ['Cuttings']);
});


test('preserves structured soil guidance from Gemini', () => {
  const result = normalizeInsights({ soil: { type: 'Well-draining mix', drainage: 'Fast', ph: '6.0-7.0' } });
  assert.deepEqual(result.soil, { type: 'Well-draining mix', drainage: 'Fast', ph: '6.0-7.0' });
});
