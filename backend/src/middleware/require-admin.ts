import { ObjectId } from '@raad/shared';
import type { RequestHandler, Response } from 'express';
import { HttpError } from '../lib/http-error.js';
import { verifyAdminToken } from '../lib/tokens.js';
import { AdminModel, type AdminDocument } from '../modules/admins/admin.model.js';

/**
 * Lets the request through only with `Authorization: Bearer <token>` from an
 * active admin. The admin is loaded on every request, so deactivating an admin
 * locks them out at once, even with an unexpired token.
 */
export const requireAdmin: RequestHandler = async (req, res, next) => {
  const token = /^Bearer (.+)$/i.exec(req.get('authorization') ?? '')?.[1];
  if (!token) {
    throw new HttpError(401, 'unauthenticated', 'Sign in to continue');
  }

  const adminId = await verifyAdminToken(token);
  const admin =
    adminId && ObjectId.safeParse(adminId).success ? await AdminModel.findById(adminId) : null;
  if (!admin?.active) {
    throw new HttpError(401, 'invalid_token', 'Your session has expired; sign in again');
  }

  res.locals.admin = admin;
  next();
};

/** The admin that requireAdmin let through. */
export function getAdmin(res: Response): AdminDocument {
  return res.locals.admin as AdminDocument;
}
