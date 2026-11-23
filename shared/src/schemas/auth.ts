import { z } from 'zod';
import { RecordMeta } from './common.js';

export const Email = z.string().trim().toLowerCase().pipe(z.email());

/** Rules for a new admin password. */
export const NewPassword = z
  .string()
  .min(10, 'Use at least 10 characters')
  .max(200, 'Use at most 200 characters');

/** Body of POST /api/auth/login. */
export const LoginInput = z.object({
  email: Email,
  password: z.string().min(1).max(200),
});
export type LoginInput = z.input<typeof LoginInput>;

export const AdminRole = z.enum(['admin']);
export type AdminRole = z.infer<typeof AdminRole>;

export const Admin = RecordMeta.extend({
  name: z.string(),
  email: z.string(),
  role: AdminRole,
  active: z.boolean(),
  lastLoginAt: z.iso.datetime().nullable(),
});
export type Admin = z.infer<typeof Admin>;

/** Response of POST /api/auth/login. Send the token as `Authorization: Bearer <token>`. */
export const LoginResponse = z.object({
  token: z.string(),
  expiresAt: z.iso.datetime(),
  admin: Admin,
});
export type LoginResponse = z.infer<typeof LoginResponse>;
