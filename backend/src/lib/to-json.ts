import type { ToObjectOptions } from 'mongoose';

/**
 * Schema toJSON options: expose `id` instead of `_id`, drop `__v`, turn
 * ObjectId references into plain strings, and leave out any `hidden` fields.
 */
export function jsonOptions(hidden: readonly string[] = []): ToObjectOptions {
  return {
    virtuals: true,
    versionKey: false,
    flattenObjectIds: true,
    transform: (_doc, ret) => {
      const { _id, ...rest } = ret as Record<string, unknown>;
      for (const field of hidden) delete rest[field];
      return rest;
    },
  };
}

export const toJSON = jsonOptions();
