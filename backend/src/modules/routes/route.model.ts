import { model, Schema } from 'mongoose';
import { toJSON } from '../../lib/to-json.js';

/** Each stop keeps its own id, so parents can later be linked to their stop. */
const stopSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
  },
  { toJSON },
);

const routeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    stops: { type: [stopSchema], required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON },
);

export const RouteModel = model('Route', routeSchema);
