import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export async function identifyPlant(buffer, mimeType) {
  const form = new FormData();
  form.append('images', new Blob([buffer], { type: mimeType }), 'plant-image');
  form.append('organs', 'auto');
  const endpoint = new URL(env.PLANT_API_URL);
  endpoint.searchParams.set('api-key', env.PLANT_API_KEY);
  let response;
  try {
    response = await fetch(endpoint, { method: 'POST', body: form, signal: AbortSignal.timeout(25000) });
  } catch {
    throw new AppError('Plant identification service timed out or is unavailable.', 504, 'PLANT_PROVIDER_TIMEOUT');
  }
  if (response.status === 429) throw new AppError('Plant identification quota exceeded. Try again later.', 503, 'PLANT_PROVIDER_QUOTA');
  if (!response.ok) throw new AppError('Plant identification provider rejected the request.', 502, 'PLANT_PROVIDER_ERROR');
  const payload = await response.json().catch(() => null);
  const best = payload?.results?.[0];
  const scientificName = best?.species?.scientificNameWithoutAuthor || best?.species?.scientificName;
  if (!scientificName) throw new AppError('No reliable match was found. Try a clear photo of the leaves or flower.', 422, 'PLANT_NOT_IDENTIFIED');
  return {
    scientificName,
    commonNames: Array.isArray(best.species.commonNames) ? best.species.commonNames : [],
    family: best.species.family?.scientificName || '',
    genus: best.species.genus?.scientificName || '',
    species: best.species.scientificNameWithoutAuthor || '',
    probability: Math.max(0, Math.min(1, Number(best.score) || 0))
  };
}
