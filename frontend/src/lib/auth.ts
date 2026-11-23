import 'server-only';
import type { Admin } from '@raad/shared';
import { redirect } from 'next/navigation';
import { apiFetch } from './api';
import { getSessionToken } from './session';

/** What the dashboard needs to know about the signed-in admin. */
export type CurrentAdmin = Pick<Admin, 'id' | 'name' | 'email'>;

/**
 * The signed-in admin, checked with the API on every call, or a redirect to
 * /login when there is no valid session. Reads the request, so call it from a
 * component inside a <Suspense> boundary.
 */
export async function getCurrentAdmin(): Promise<CurrentAdmin> {
  const token = await getSessionToken();
  if (!token) redirect('/login');

  const res = await apiFetch('/api/auth/me', { token });
  if (res.status === 401) redirect('/login?expired=1');
  if (!res.ok) throw new Error(`GET /api/auth/me failed with ${res.status}`);

  const admin = (await res.json()) as Admin;
  return { id: admin.id, name: admin.name, email: admin.email };
}
