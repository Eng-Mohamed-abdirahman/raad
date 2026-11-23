import { model, Schema } from 'mongoose';
import { jsonOptions } from '../../lib/to-json.js';

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    /** argon2id hash. Never selected unless asked for with select('+passwordHash'). */
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin'], default: 'admin' },
    active: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true, toJSON: jsonOptions(['passwordHash']) },
);

export const AdminModel = model('Admin', adminSchema);
export type AdminDocument = ReturnType<(typeof AdminModel)['hydrate']>;
