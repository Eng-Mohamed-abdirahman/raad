import 'server-only';
import type { Bus, Driver, Route } from '@raad/shared';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { apiFetch } from './api';
import { getSessionToken } from './session';

/** GET from the API as the signed-in admin. Redirects to /login when signed out. */
async function getFromApi<T>(path: string): Promise<T> {
  const token = await getSessionToken();
  if (!token) redirect('/login');

  const res = await apiFetch(path, { token });
  if (res.status === 401) redirect('/login?expired=1');
  if (!res.ok) throw new Error(`GET ${path} failed with ${res.status}`);
  return (await res.json()) as T;
}

// cache() shares one API call per request between the components that need the list.
export const getDrivers = cache(() => getFromApi<Driver[]>('/api/drivers'));
export const getRoutes = cache(() => getFromApi<Route[]>('/api/routes'));
export const getBuses = cache(() => getFromApi<Bus[]>('/api/buses'));
