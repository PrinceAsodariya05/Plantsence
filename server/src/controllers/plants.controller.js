import { z } from 'zod';
import { PlantScan } from '../models/PlantScan.js';
import { identifyPlant } from '../services/plantIdentification.service.js';
import { generatePlantInsights } from '../services/gemini.service.js';
import { AppError } from '../utils/AppError.js';
import { normalizeInsights } from '../utils/normalizeInsights.js';

const sessionSchema = z.string().min(8).max(100).regex(/^[a-zA-Z0-9_-]+$/);
function getSessionId(value) {
  const parsed = sessionSchema.safeParse(value);
  if (!parsed.success) throw new AppError('A valid sessionId is required.', 400, 'INVALID_SESSION');
  return parsed.data;
}
export async function identify(req, res, next) {
  try {
    const sessionId = getSessionId(req.body.sessionId);
    const identification = await identifyPlant(req.file.buffer, req.file.detectedMimeType);
    const generatedInsights = await generatePlantInsights(identification);
    const insights = normalizeInsights(generatedInsights);
    const imageDataUrl = `data:${req.file.detectedMimeType};base64,${req.file.buffer.toString('base64')}`;
    const scan = await PlantScan.create({ sessionId, imageDataUrl, identification, insights });
    res.status(201).json({ success: true, data: { ...scan.toObject(), imageDataUrl } });
  } catch (error) { next(error); }
}
export async function history(req, res, next) {
  try {
    const sessionId = getSessionId(req.query.sessionId);
    const scans = await PlantScan.find({ sessionId }).select('+imageDataUrl').sort({ createdAt: -1 }).limit(30).lean();
    res.json({ success: true, data: scans });
  } catch (error) { next(error); }
}
