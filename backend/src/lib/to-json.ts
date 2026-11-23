import type { ToObjectOptions } from 'mongoose';

/**
 * Schema toJSON options: expose `id` instead of `_id`, drop `__v`, and turn
 * ObjectId references into plain strings.
 */
export const toJSON: ToObjectOptions = {
  virtuals: true,
  versionKey: false,
  flattenObjectIds: true,
  transform: (_doc, ret) => {
    const { _id, ...rest } = ret as Record<string, unknown>;
    return rest;
  },
};
