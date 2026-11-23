import { z } from 'zod';
import { RecordMeta } from './common.js';

/** Body of POST /api/drivers. */
export const DriverInput = z.object({
  name: z.string().trim().min(1).max(100),
  /** Digits only, optionally starting with +, e.g. +252634123456. */
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, 'Must be 7 to 15 digits, optionally starting with +'),
  licenseNumber: z.string().trim().min(1).max(50).optional(),
  /** Defaults to true. */
  active: z.boolean().optional(),
});
export type DriverInput = z.input<typeof DriverInput>;

/** Body of PATCH /api/drivers/:id. */
export const DriverUpdate = DriverInput.partial();
export type DriverUpdate = z.input<typeof DriverUpdate>;

export const Driver = RecordMeta.extend({
  name: z.string(),
  phone: z.string(),
  licenseNumber: z.string().optional(),
  active: z.boolean(),
});
export type Driver = z.infer<typeof Driver>;
