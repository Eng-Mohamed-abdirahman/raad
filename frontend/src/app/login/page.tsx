import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RaadLogo } from '@/components/raad/logo';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Sign in · Raad Admin',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-[420px] flex-col gap-8">
        <RaadLogo size={40} className="self-center" />

        <div className="flex flex-col gap-6 rounded-[20px] border border-subtle bg-surface p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-admin-h1">Sign in</h1>
            <p className="text-small text-secondary">
              School admins only. Manage buses, drivers and routes.
            </p>
          </div>

          {/* The form reads ?next= and ?expired=, which are only known per request. */}
          <Suspense fallback={<div className="h-[264px]" aria-hidden="true" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-caption text-muted">
          No account? Ask an existing admin to create one for you.
        </p>
      </div>
    </main>
  );
}
