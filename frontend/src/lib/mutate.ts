import 'server-only';
import type { ApiError } from '@raad/shared';
import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { ApiUnreachableError, apiFetch } from './api';
import type { FormState } from './form-state';
import { getSessionToken } from './session';

/**
 * Sends a change to the API as the signed-in admin and turns the answer into
 * form state. On success it refreshes the page so lists show the change.
 * Call it only from a Server Action.
 */
export async function sendToApi(
  method: 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<FormState> {
  const token = await getSessionToken();
  if (!token) redirect('/login');

  let res: Response;
  try {
    res = await apiFetch(path, {
      method,
      token,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof ApiUnreachableError) {
      return { error: "Can't reach the Raad server. Check it is running and try again." };
    }
    throw error;
  }

  if (res.status === 401) redirect('/login?expired=1');
  if (res.ok) {
    refresh();
    return { ok: true };
  }

  const apiError = ((await res.json().catch(() => null)) as ApiError | null)?.error;
  const fieldErrors: Record<string, string> = {};

  if (apiError?.code === 'validation_failed' && Array.isArray(apiError.details)) {
    for (const { path: field, message } of apiError.details as {
      path: string;
      message: string;
    }[]) {
      fieldErrors[field] ??= message;
    }
    return { error: 'Check the highlighted fields.', fieldErrors };
  }

  // Duplicates and bad references name the field they are about.
  const field = (apiError?.details as { field?: unknown } | undefined)?.field;
  if (typeof field === 'string' && field && apiError) {
    fieldErrors[field] = apiError.message;
  }
  return {
    error: apiError?.message ?? `Something went wrong (${res.status}). Try again.`,
    fieldErrors,
  };
}
