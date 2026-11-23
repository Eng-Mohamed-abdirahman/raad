'use client';

import { useEffect } from 'react';
import { Icon } from '@/components/raad/icon';
import { Button } from '@/components/ui/button';

export default function DashboardError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-start gap-4 rounded-[16px] border border-subtle bg-surface p-6">
      <Icon name="wifi-off" size={28} className="text-red-700" />
      <div className="flex flex-col gap-1">
        <h1 className="text-admin-h2">This page couldn&apos;t load</h1>
        <p className="text-small text-secondary">
          The Raad server may be down or restarting. Check it is running, then try again.
        </p>
      </div>
      <Button variant="secondary" onClick={() => retry()}>
        Try again
      </Button>
    </div>
  );
}
