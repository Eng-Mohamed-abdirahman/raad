import 'server-only';
import { cookies } from 'next/headers';

/** httpOnly cookie that holds the admin's API token. Browser JavaScript can't read it. */
export const SESSION_COOKIE = 'raad_session';

export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

/** Only callable from a Server Action or Route Handler. */
export async function setSessionToken(token: string, expiresAt: Date): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

/** Only callable from a Server Action or Route Handler. */
export async function clearSessionToken(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
