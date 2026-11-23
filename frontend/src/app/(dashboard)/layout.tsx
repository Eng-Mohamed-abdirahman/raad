import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { MobileNav, SidebarNav } from '@/components/fleet/dashboard-nav';
import { RaadLogo } from '@/components/raad/logo';
import { Button } from '@/components/ui/button';
import { getCurrentAdmin } from '@/lib/auth';
import { logout } from '../login/actions';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-1">
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col gap-8 bg-navy-900 px-3 py-5 md:flex">
        <RaadLogo surface="onDark" size={30} className="px-2" />
        <SidebarNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-subtle bg-surface px-4 sm:px-6">
          <RaadLogo size={28} className="md:invisible" />
          {/* The session is read per request, so it streams in behind a boundary. */}
          <Suspense fallback={<div className="h-9 w-40" aria-hidden="true" />}>
            <AccountMenu />
          </Suspense>
        </header>
        <MobileNav />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
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
