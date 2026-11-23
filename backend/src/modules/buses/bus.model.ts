import { model, Schema } from 'mongoose';
import { toJSON } from '../../lib/to-json.js';

const busSchema = new Schema(
  {
    plateNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
    label: { type: String, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', default: null },
    routeId: { type: Schema.Types.ObjectId, ref: 'Route', default: null, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON },
);

// A driver can be assigned to only one bus; unassigned buses (null) don't clash.
busSchema.index(
  { driverId: 1 },
  { unique: true, partialFilterExpression: { driverId: { $type: 'objectId' } } },
);

export const BusModel = model('Bus', busSchema);
