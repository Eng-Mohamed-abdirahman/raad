import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/raad/icon';

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-admin-h1">{title}</h1>
        <p className="text-small text-secondary">{description}</p>
      </div>
      {action}
    </div>
  );
}

/** White card that holds a table. */
export function TableCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-subtle bg-surface">{children}</div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: IconName;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[16px] border border-dashed border-strong bg-surface px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-yellow-100 text-navy-900">
        <Icon name={icon} size={28} />
      </span>
      <h2 className="text-admin-h2">{title}</h2>
      <p className="max-w-sm text-small text-secondary">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

/** Grey bars shown while a table streams in. */
export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div
      className="flex flex-col gap-3 rounded-[16px] border border-subtle bg-surface p-5"
      aria-busy="true"
      aria-label="Loading"
    >
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-[8px] bg-sand-100" />
      ))}
    </div>
  );
}
