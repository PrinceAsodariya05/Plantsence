import { AppError } from '../utils/AppError.js';

export function notFound(_req, _res, next) {
  next(new AppError('The requested endpoint was not found.', 404, 'NOT_FOUND'));
}
export function errorHandler(err, _req, res, _next) {
  if (err.name === 'ValidationError') {
    console.error('[Mongoose validation failed]', Object.entries(err.errors || {}).map(([path, detail]) => ({ path, message: detail.message, kind: detail.kind, value: detail.value })));
  } else if (process.env.NODE_ENV !== 'test') {
    console.error('[API error]', err);
  }
  let status = err.statusCode || 500;
  let code = err.code || 'INTERNAL_ERROR';
  let message = err.isOperational ? err.message : 'An unexpected server error occurred.';
  if (err.name === 'ValidationError') { status = 400; code = 'DATABASE_VALIDATION'; message = 'The submitted data could not be saved.'; }
  if (err.name === 'CastError') { status = 400; code = 'INVALID_ID'; message = 'The requested record is invalid.'; }
  if (err.code === 11000) { status = 409; code = 'DUPLICATE_RECORD'; message = 'A record with these details already exists.'; }
  res.status(status).json({ success: false, error: { code, message } });
}
