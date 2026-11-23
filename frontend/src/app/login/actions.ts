'use server';

import { LoginInput, type ApiError, type LoginResponse } from '@raad/shared';
import { redirect } from 'next/navigation';
import { ApiUnreachableError, apiFetch } from '@/lib/api';
import { clearSessionToken, setSessionToken } from '@/lib/session';

export type LoginState = {
  /** Shown above the form. */
  error?: string;
  fieldErrors?: { email?: string; password?: string };
  /** Echoed back so the email field keeps its value after an error. */
  email?: string;
};

/** Messages for the API's error codes, in the words an admin should see. */
const MESSAGES: Record<number, string> = {
  401: 'The email or password is incorrect.',
  403: 'This account has been disabled. Ask another admin to turn it back on.',
  429: 'Too many sign-in attempts. Wait 15 minutes and try again.',
};

/** Only allow redirects to a path on this site, never to another origin. */
function safeNextPath(value: FormDataEntryValue | null): string {
  const next = typeof value === 'string' ? value : '';
  return next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : '/';
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '');
  const parsed = LoginInput.safeParse({ email, password: formData.get('password') ?? '' });
  if (!parsed.success) {
    const fieldErrors: LoginState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0] === 'email') fieldErrors.email = 'Enter a valid email address.';
      if (issue.path[0] === 'password') fieldErrors.password = 'Enter your password.';
    }
    return { fieldErrors, email };
  }

  let res: Response;
  try {
    res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    });
  } catch (error) {
    if (error instanceof ApiUnreachableError) {
      return { error: "Can't reach the Raad server. Check it is running and try again.", email };
    }
    throw error;
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiError | null;
    return {
      error: MESSAGES[res.status] ?? body?.error.message ?? 'Sign-in failed. Try again.',
      email,
    };
  }

  const { token, expiresAt } = (await res.json()) as LoginResponse;
  await setSessionToken(token, new Date(expiresAt));
  redirect(safeNextPath(formData.get('next')));
}

export async function logout(): Promise<void> {
  await clearSessionToken();
  redirect('/login');
}
