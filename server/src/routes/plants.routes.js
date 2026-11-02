import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { uploadPlantImage } from '../middlewares/upload.js';
import { identify, history } from '../controllers/plants.controller.js';

const router = Router();
const identifyLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many identification requests. Please wait and try again.' } }
});
router.post('/identify', identifyLimiter, uploadPlantImage, identify);
router.get('/history', history);
export default router;
