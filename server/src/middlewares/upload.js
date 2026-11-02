import multer from 'multer';
import { AppError } from '../utils/AppError.js';
import { detectImageType } from '../utils/imageValidation.js';

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 3, parts: 5 },
  fileFilter: (_req, file, cb) => {
    if (!allowed.has(file.mimetype)) return cb(new AppError('Only JPEG, PNG and WebP images are accepted.', 415, 'UNSUPPORTED_IMAGE_TYPE'));
    cb(null, true);
  }
});
export const uploadPlantImage = (req, res, next) => uploader.single('image')(req, res, err => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') return next(new AppError('Image must be 5 MB or smaller.', 413, 'IMAGE_TOO_LARGE'));
  if (err) return next(err);
  if (!req.file) return next(new AppError('Please attach an image using the image field.', 400, 'IMAGE_REQUIRED'));
  const actualType = detectImageType(req.file.buffer);
  if (!actualType || actualType !== req.file.mimetype) return next(new AppError('Image content does not match its file type.', 415, 'INVALID_IMAGE_CONTENT'));
  req.file.detectedMimeType = actualType;
  next();
});
