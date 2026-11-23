import { model, Schema } from 'mongoose';
import { toJSON } from '../../lib/to-json.js';

const driverSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    licenseNumber: { type: String, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON },
);

export const DriverModel = model('Driver', driverSchema);
