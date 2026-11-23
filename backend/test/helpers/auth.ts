import type { Express } from 'express';
import request, { type Test } from 'supertest';
import { beforeEach } from 'vitest';
import { signAdminToken } from '../../src/lib/tokens.js';
import { AdminModel } from '../../src/modules/admins/admin.model.js';

/**
 * A supertest client that sends a valid admin token with every request.
 * The admin is created before each test, after the database was emptied.
 */
export function signedInClient(app: Express) {
  let token = '';

  beforeEach(async () => {
    // Token checks never read the hash, so skip the slow argon2 step.
    const admin = await AdminModel.create({
      name: 'Test Admin',
      email: 'test-admin@raad.test',
      passwordHash: 'not-used',
    });
    ({ token } = await signAdminToken(admin.id));
  });

  const withToken = (test: Test) => test.set('Authorization', `Bearer ${token}`);

  return {
    get: (url: string) => withToken(request(app).get(url)),
    post: (url: string) => withToken(request(app).post(url)),
    patch: (url: string) => withToken(request(app).patch(url)),
    delete: (url: string) => withToken(request(app).delete(url)),
  };
}
