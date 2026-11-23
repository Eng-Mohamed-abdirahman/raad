import { LoginInput } from '@raad/shared';
import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { HttpError } from '../../lib/http-error.js';
import { verifyAgainstDummy, verifyPassword } from '../../lib/password.js';
import { signAdminToken } from '../../lib/tokens.js';
import { parseBody } from '../../lib/validate.js';
import { getAdmin, requireAdmin } from '../../middleware/require-admin.js';
import { AdminModel } from '../admins/admin.model.js';

/** Failed sign-ins allowed per IP address in each 15-minute window. */
export const LOGIN_ATTEMPT_LIMIT = 10;

/** Built per app, so each app (and each test) gets its own attempt counter. */
export function createAuthRouter(): Router {
  const router = Router();

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: LOGIN_ATTEMPT_LIMIT,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, _res, next) => {
      next(
        new HttpError(
          429,
          'too_many_attempts',
          'Too many sign-in attempts; try again in 15 minutes',
        ),
      );
    },
  });

  router.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = parseBody(LoginInput, req.body);

    const admin = await AdminModel.findOne({ email }).select('+passwordHash');
    const passwordOk = admin
      ? await verifyPassword(admin.passwordHash, password)
      : await verifyAgainstDummy(password);
    if (!admin || !passwordOk) {
      throw new HttpError(401, 'invalid_credentials', 'The email or password is incorrect');
    }
    if (!admin.active) {
      throw new HttpError(403, 'account_disabled', 'This account has been disabled');
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const { token, expiresAt } = await signAdminToken(admin.id);
    res.json({ token, expiresAt: expiresAt.toISOString(), admin });
  });

  router.get('/me', requireAdmin, (_req, res) => {
    res.json(getAdmin(res));
  });

  return router;
}
