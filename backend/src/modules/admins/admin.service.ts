import { Email, NewPassword } from '@raad/shared';
import { z } from 'zod';
import { HttpError } from '../../lib/http-error.js';
import { hashPassword } from '../../lib/password.js';
import { parseBody } from '../../lib/validate.js';
import { AdminModel, type AdminDocument } from './admin.model.js';

const NewAdmin = z.object({
  name: z.string().trim().min(1).max(100),
  email: Email,
  password: NewPassword,
});

/** Creates an admin with a hashed password. Throws if the email is taken. */
export async function createAdmin(input: z.input<typeof NewAdmin>): Promise<AdminDocument> {
  const { name, email, password } = parseBody(NewAdmin, input);
  if (await AdminModel.exists({ email })) {
    throw new HttpError(409, 'duplicate', `An admin with the email ${email} already exists`);
  }
  return AdminModel.create({ name, email, passwordHash: await hashPassword(password) });
}

/** Sets a new password for an existing admin. */
export async function resetAdminPassword(email: string, password: string): Promise<AdminDocument> {
  const input = parseBody(z.object({ email: Email, password: NewPassword }), { email, password });
  const admin = await AdminModel.findOneAndUpdate(
    { email: input.email },
    { passwordHash: await hashPassword(input.password) },
    { returnDocument: 'after' },
  );
  if (!admin) {
    throw new HttpError(404, 'not_found', `No admin with the email ${input.email}`);
  }
  return admin;
}
