import { z } from 'zod';

/** One GPS reading sent by the driver app during an active trip. */
export const LocationPing = z.object({
  busId: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  /** Metres per second. */
  speed: z.number().min(0),
  /** Degrees clockwise from north, 0–360. */
  heading: z.number().min(0).max(360),
  /** Horizontal accuracy in metres. */
  accuracy: z.number().min(0),
  /** When the phone took the reading (ISO 8601). */
  recordedAt: z.iso.datetime(),
});

export type LocationPing = z.infer<typeof LocationPing>;
