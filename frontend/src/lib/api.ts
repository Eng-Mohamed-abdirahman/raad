import 'server-only';

/** The Raad API, called from the Next.js server only. */
const API_URL = (process.env.RAAD_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');

/** Thrown when the API can't be reached at all (down, wrong URL). */
export class ApiUnreachableError extends Error {
  constructor(cause: unknown) {
    super(`Could not reach the Raad API at ${API_URL}`, { cause });
    this.name = 'ApiUnreachableError';
  }
}

/** fetch() against the API, never cached, with the admin token when given. */
export async function apiFetch(
  path: string,
  { token, headers, ...init }: RequestInit & { token?: string } = {},
): Promise<Response> {
  try {
    return await fetch(`${API_URL}${path}`, {
      ...init,
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch (error) {
    throw new ApiUnreachableError(error);
  }
}
