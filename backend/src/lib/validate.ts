import { ObjectId } from '@raad/shared';
import type { z } from 'zod';
import { HttpError, notFound } from './http-error.js';

/** Parses a request body, or throws a 400 listing every invalid field. */
export function parseBody<T extends z.ZodType>(schema: T, body: unknown): z.output<T> {
  const result = schema.safeParse(body);
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    throw new HttpError(400, 'validation_failed', 'The request body is invalid', details);
  }
  return result.data;
}

/** Returns the id from a URL, or throws a 404 when it cannot be a record id. */
export function parseId(id: string | undefined, what: string): string {
  if (!ObjectId.safeParse(id).success) {
    throw notFound(what);
  }
  return id as string;
}
