import { NextResponse, type NextRequest } from 'next/server';

// Keep in sync with SESSION_COOKIE in lib/session.ts (that module is server-only).
const SESSION_COOKIE = 'raad_session';

/** Pages anyone can open without signing in. */
const PUBLIC_PATHS = ['/login', '/design-system'];

/**
 * Optimistic check: send visitors with no session cookie to /login before the
 * page renders. Pages still verify the session with the API (lib/auth.ts).
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  if (isPublic || request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', request.url);
  if (pathname !== '/') loginUrl.searchParams.set('next', `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Skip Next.js internals and files with an extension (images, favicon, fonts).
  matcher: ['/((?!_next/|api/|.*\\.[^/]+$).*)'],
};
