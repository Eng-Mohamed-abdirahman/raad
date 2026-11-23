import { SignJWT } from 'jose';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { signAdminToken } from '../src/lib/tokens.js';
import { AdminModel } from '../src/modules/admins/admin.model.js';
import { createAdmin, resetAdminPassword } from '../src/modules/admins/admin.service.js';
import { LOGIN_ATTEMPT_LIMIT } from '../src/modules/auth/auth.router.js';
import { useTestDatabase } from './helpers/database.js';

useTestDatabase();

const amina = { name: 'Amina Yusuf', email: 'amina@school.so', password: 'correct-horse-battery' };

async function login(app = createApp(), email = amina.email, password = amina.password) {
  return request(app).post('/api/auth/login').send({ email, password });
}

describe('POST /api/auth/login', () => {
  it('returns a token and the admin, never the password hash', async () => {
    await createAdmin(amina);

    const res = await login();

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(new Date(res.body.expiresAt).getTime()).toBeGreaterThan(Date.now());
    expect(res.body.admin).toMatchObject({
      name: amina.name,
      email: amina.email,
      role: 'admin',
      active: true,
    });
    expect(res.body.admin.lastLoginAt).not.toBeNull();
    expect(JSON.stringify(res.body)).not.toContain('passwordHash');
    expect(JSON.stringify(res.body)).not.toContain('$argon2');
  });

  it('ignores case and spaces in the email', async () => {
    await createAdmin(amina);

    expect((await login(createApp(), '  AMINA@School.so ')).status).toBe(200);
  });

  it('gives the same answer for a wrong password and an unknown email', async () => {
    await createAdmin(amina);

    const wrongPassword = await login(createApp(), amina.email, 'not-the-password');
    const unknownEmail = await login(createApp(), 'nobody@school.so', amina.password);

    expect(wrongPassword.status).toBe(401);
    expect(unknownEmail.status).toBe(401);
    expect(wrongPassword.body).toEqual(unknownEmail.body);
    expect(wrongPassword.body.error.code).toBe('invalid_credentials');
  });

  it('refuses a disabled admin', async () => {
    await createAdmin(amina);
    await AdminModel.updateOne({ email: amina.email }, { active: false });

    const res = await login();

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('account_disabled');
  });

  it('rejects a missing password with 400', async () => {
    const res = await request(createApp()).post('/api/auth/login').send({ email: amina.email });

    expect(res.status).toBe(400);
  });

  it(`blocks an IP after ${LOGIN_ATTEMPT_LIMIT} failed attempts`, async () => {
    await createAdmin(amina);
    const app = createApp();

    for (let i = 0; i < LOGIN_ATTEMPT_LIMIT; i++) {
      expect((await login(app, amina.email, 'wrong-password')).status).toBe(401);
    }
    const blocked = await login(app);

    expect(blocked.status).toBe(429);
    expect(blocked.body.error.code).toBe('too_many_attempts');
  });
});

describe('GET /api/auth/me and protected endpoints', () => {
  it('returns the signed-in admin', async () => {
    await createAdmin(amina);
    const { body } = await login();

    const res = await request(createApp())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(amina.email);
  });

  it('needs a token', async () => {
    const app = createApp();

    for (const path of ['/api/auth/me', '/api/drivers', '/api/routes', '/api/buses']) {
      const res = await request(app).get(path);
      expect(res.status, path).toBe(401);
      expect(res.body.error.code).toBe('unauthenticated');
    }
  });

  it('opens protected endpoints with a valid token', async () => {
    await createAdmin(amina);
    const { body } = await login();

    const res = await request(createApp())
      .get('/api/buses')
      .set('Authorization', `Bearer ${body.token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('rejects a malformed token, a forged token and an expired token', async () => {
    const admin = await createAdmin(amina);
    const forged = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(admin.id)
      .setIssuer('raad-api')
      .setAudience('raad-admin')
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode('a-different-secret-that-is-long-enough!!'));
    const expired = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(admin.id)
      .setIssuer('raad-api')
      .setAudience('raad-admin')
      .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    for (const token of ['not-a-jwt', forged, expired]) {
      const res = await request(createApp())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('invalid_token');
    }
  });

  it('locks out an admin as soon as they are disabled, even with a valid token', async () => {
    const admin = await createAdmin(amina);
    const { token } = await signAdminToken(admin.id);
    await AdminModel.updateOne({ _id: admin.id }, { active: false });

    const res = await request(createApp())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(401);
  });
});

describe('admin service', () => {
  it('stores an argon2id hash, not the password', async () => {
    await createAdmin(amina);

    const stored = await AdminModel.findOne({ email: amina.email }).select('+passwordHash');

    expect(stored?.passwordHash).toMatch(/^\$argon2id\$/);
    expect(stored?.passwordHash).not.toContain(amina.password);
  });

  it('refuses a duplicate email and a short password', async () => {
    await createAdmin(amina);

    await expect(createAdmin(amina)).rejects.toMatchObject({ status: 409 });
    await expect(
      createAdmin({ ...amina, email: 'other@school.so', password: 'short' }),
    ).rejects.toMatchObject({ status: 400, code: 'validation_failed' });
  });

  it('resets a password so only the new one works', async () => {
    await createAdmin(amina);
    await resetAdminPassword(amina.email, 'a-brand-new-password');

    expect((await login()).status).toBe(401);
    expect((await login(createApp(), amina.email, 'a-brand-new-password')).status).toBe(200);
  });
});
