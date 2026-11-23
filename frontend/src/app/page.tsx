import { Suspense } from 'react';
import { RaadLogo } from '@/components/raad/logo';
import { Button } from '@/components/ui/button';
import { getCurrentAdmin } from '@/lib/auth';
import { logout } from './login/actions';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-subtle bg-surface px-4 py-3 sm:px-6">
        <RaadLogo size={32} />
        <Suspense fallback={<div className="h-9 w-40" aria-hidden="true" />}>
          <AccountMenu />
        </Suspense>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-10 sm:px-6">
        <Suspense fallback={<h1 className="text-admin-h1">Welcome</h1>}>
          <Greeting />
        </Suspense>
        <p className="text-body text-secondary">
          Buses, drivers, routes and the live map are coming to this dashboard next.
        </p>
      </main>
    </div>
  );
}

async function Greeting() {
  const admin = await getCurrentAdmin();
  return <h1 className="text-admin-h1">Welcome, {admin.name.split(' ')[0]}</h1>;
}

async function AccountMenu() {
  const admin = await getCurrentAdmin();
  return (
    <div className="flex items-center gap-3">
      <div className="hidden flex-col items-end sm:flex">
        <span className="text-small font-semibold text-primary">{admin.name}</span>
        <span className="text-caption text-muted">{admin.email}</span>
      </div>
      <form action={logout}>
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
