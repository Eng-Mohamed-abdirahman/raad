import { z } from 'zod';
import { ObjectId, RecordMeta } from './common.js';

/** Body of POST /api/buses. */
export const BusInput = z.object({
  /** Stored in upper case. */
  plateNumber: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .transform((plate) => plate.toUpperCase()),
  /** A short name people use, e.g. "Bus 3". An empty string clears it. */
  label: z.string().trim().max(50).optional(),
  capacity: z.number().int().min(1).max(100),
  /** The assigned driver; null unassigns. A driver can drive only one bus. */
  driverId: ObjectId.nullable().optional(),
  /** The assigned route; null unassigns. */
  routeId: ObjectId.nullable().optional(),
  /** Defaults to true. */
  active: z.boolean().optional(),
});
export type BusInput = z.input<typeof BusInput>;

/** Body of PATCH /api/buses/:id. */
export const BusUpdate = BusInput.partial();
export type BusUpdate = z.input<typeof BusUpdate>;

export const Bus = RecordMeta.extend({
  plateNumber: z.string(),
  label: z.string().optional(),
  capacity: z.number().int(),
  driverId: ObjectId.nullable(),
  routeId: ObjectId.nullable(),
  active: z.boolean(),
});
export type Bus = z.infer<typeof Bus>;
