import { z } from 'zod';

/** A MongoDB ObjectId as a 24-character hex string. */
export const ObjectId = z.string().regex(/^[0-9a-f]{24}$/i, 'Must be a valid id');

export const Latitude = z.number().min(-90).max(90);
export const Longitude = z.number().min(-180).max(180);

/** Fields every stored record has in API responses. */
export const RecordMeta = z.object({
  id: ObjectId,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

/** The body of every error response from the API. */
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
