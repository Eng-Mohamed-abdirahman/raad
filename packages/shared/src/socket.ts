import type { LocationPing } from './schemas/location.js';

/** Events the driver app, parent app and admin send to the API. */
export interface ClientToServerEvents {
  'driver:location': (ping: LocationPing) => void;
  'bus:join': (busId: string) => void;
}

/** Events the API sends to connected clients. */
export interface ServerToClientEvents {
  'bus:location': (ping: LocationPing) => void;
}
