'use client';

import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login, type LoginState } from './actions';

export function LoginForm() {
  const searchParams = useSearchParams();
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});
  const expired = searchParams.get('expired') === '1' && !state.error && !state.fieldErrors;
  const notice = state.error ?? (expired ? 'Your session has ended. Sign in again.' : undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="next" value={searchParams.get('next') ?? '/'} />

      {notice ? (
        <p
          role="alert"
          className="rounded-[12px] border-[1.5px] border-red-200 bg-red-50 px-4 py-3 text-small text-red-800"
        >
          {notice}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          autoFocus
          required
          defaultValue={state.email}
          aria-invalid={state.fieldErrors?.email ? true : undefined}
          aria-describedby={state.fieldErrors?.email ? 'email-error' : undefined}
        />
        {state.fieldErrors?.email ? (
          <p id="email-error" className="text-caption text-red-700">
            {state.fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={state.fieldErrors?.password ? true : undefined}
          aria-describedby={state.fieldErrors?.password ? 'password-error' : undefined}
        />
        {state.fieldErrors?.password ? (
          <p id="password-error" className="text-caption text-red-700">
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
