import { jwtVerify, SignJWT } from 'jose';
import { env } from '../config/env.js';

const ISSUER = 'raad-api';
const AUDIENCE = 'raad-admin';
/** How long an admin stays signed in. */
export const ADMIN_TOKEN_TTL_SECONDS = 8 * 60 * 60;

function signingKey(): Uint8Array {
  return new TextEncoder().encode(env.JWT_SECRET);
}

/** Signs an HS256 token whose subject is the admin's id. */
export async function signAdminToken(adminId: string): Promise<{ token: string; expiresAt: Date }> {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + ADMIN_TOKEN_TTL_SECONDS;
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(adminId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiresAt)
    .sign(signingKey());
  return { token, expiresAt: new Date(expiresAt * 1000) };
}

/** Returns the admin id in a valid, unexpired token, or null for anything else. */
export async function verifyAdminToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, signingKey(), {
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithms: ['HS256'],
    });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}
