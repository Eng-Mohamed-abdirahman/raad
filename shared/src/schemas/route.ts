import { z } from 'zod';
import { Latitude, Longitude, ObjectId, RecordMeta } from './common.js';

/** A pick-up or drop-off point. Stops are visited in array order. */
export const StopInput = z.object({
  name: z.string().trim().min(1).max(100),
  lat: Latitude,
  lng: Longitude,
});
export type StopInput = z.input<typeof StopInput>;

/** Body of POST /api/routes. */
export const RouteInput = z.object({
  name: z.string().trim().min(1).max(100),
  stops: z.array(StopInput).min(2, 'A route needs at least 2 stops').max(100),
  /** Defaults to true. */
  active: z.boolean().optional(),
});
export type RouteInput = z.input<typeof RouteInput>;

/** Body of PATCH /api/routes/:id. Sending stops replaces the whole list. */
export const RouteUpdate = RouteInput.partial();
export type RouteUpdate = z.input<typeof RouteUpdate>;

export const Stop = StopInput.extend({ id: ObjectId });
export type Stop = z.infer<typeof Stop>;

export const Route = RecordMeta.extend({
  name: z.string(),
  stops: z.array(Stop),
  active: z.boolean(),
});
export type Route = z.infer<typeof Route>;
