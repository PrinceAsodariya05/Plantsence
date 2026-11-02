import test from 'node:test';
import assert from 'node:assert/strict';
import { PlantScan } from '../src/models/PlantScan.js';

test('PlantScan accepts structured soil object from Gemini', async () => {
  const scan = new PlantScan({
    sessionId: 'test-session-123',
    imageDataUrl: 'data:image/jpeg;base64,AA==',
    identification: {
      scientificName: 'Rafflesia arnoldii',
      commonNames: ['Rafflesia'],
      probability: 0.98
    },
    insights: {
      overview: 'Parasitic flowering plant.',
      soil: {
        type: 'Not applicable; it is an endoparasite.',
        drainage: 'Not applicable.',
        ph: 'Not applicable.'
      }
    }
  });

  await assert.doesNotReject(() => scan.validate());
  assert.equal(scan.insights.soil.type, 'Not applicable; it is an endoparasite.');
});
