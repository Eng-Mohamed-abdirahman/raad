import type { ApiError } from '@raad/shared';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { HttpError } from '../lib/http-error.js';
import { logger } from '../lib/logger.js';

/** Friendly messages for unique-index clashes, by field. */
const DUPLICATE_MESSAGES: Record<string, string> = {
  phone: 'A driver with this phone number already exists',
  name: 'A route with this name already exists',
  plateNumber: 'A bus with this plate number already exists',
  driverId: 'This driver is already assigned to another bus',
};

interface MongoDuplicateKeyError {
  code: 11000;
  keyValue?: Record<string, unknown>;
}

function isDuplicateKeyError(error: unknown): error is MongoDuplicateKeyError {
  return (
    typeof error === 'object' && error !== null && (error as { code?: unknown }).code === 11000
  );
}

function send(
  res: Parameters<ErrorRequestHandler>[2],
  status: number,
  body: ApiError['error'],
): void {
  res.status(status).json({ error: body } satisfies ApiError);
}

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, 'not_found', `No route for ${req.method} ${req.path}`));
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  if (error instanceof HttpError) {
    send(res, error.status, { code: error.code, message: error.message, details: error.details });
    return;
  }

  if (isDuplicateKeyError(error)) {
    const field = Object.keys(error.keyValue ?? {})[0] ?? '';
    send(res, 409, {
      code: 'duplicate',
      message: DUPLICATE_MESSAGES[field] ?? 'A record with these details already exists',
      details: { field },
    });
    return;
  }

  // express.json() rejects a body that is not valid JSON.
  if ((error as { type?: unknown }).type === 'entity.parse.failed') {
    send(res, 400, { code: 'invalid_json', message: 'The request body is not valid JSON' });
    return;
  }

  logger.error({ err: error }, 'Unhandled error');
  send(res, 500, { code: 'internal_error', message: 'Something went wrong' });
};
