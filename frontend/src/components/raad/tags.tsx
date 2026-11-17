import { cn } from 'cn';
import type { ComponentProps, ReactNode } from 'react';

/** Bus plate or route code, in JetBrains Mono. `light` for use on dark map tiles or yellow cards. */
export function PlateTag({
  children,
  light = false,
  className,
}: {
  children: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex h-6.5 items-center rounded-[6px] px-2 font-mono text-[12.5px] font-medium tracking-[0.04em]',
        light ? 'bg-yellow-100 text-navy-900' : 'bg-navy-900 text-yellow-300',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** "Live" indicator for maps: green dot when positions are fresh, grey when the feed is stale. */
export function LivePill({
  live = true,
  children,
  className,
}: {
  live?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex h-8 items-center gap-2 rounded-pill bg-white px-3 text-[13px] font-semibold text-navy-900 shadow-2',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-2.5 rounded-full',
          live
            ? 'bg-green-600 shadow-[0_0_0_3px_var(--green-100)]'
            : 'bg-navy-400 shadow-[0_0_0_3px_var(--sand-200)]',
        )}
      />
      {children ?? (live ? 'Live' : 'Offline')}
    </span>
  );
}

/** Red unread-count badge (notifications, alerts). */
export function CountBadge({ count, className }: { count: number; className?: string }) {
  return (
    <span
      className={cn(
        'inline-grid h-5 min-w-5 place-items-center rounded-pill bg-red-600 px-1.5 text-[11.5px] font-bold text-white tabular',
        className,
      )}
    >
      {count}
    </span>
  );
}

/** Filter chip. `selected` turns it navy. */
export function Chip({
  selected = false,
  className,
  ...props
}: ComponentProps<'button'> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-pill border-[1.5px] px-3.5 text-sm font-semibold transition-colors outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
        selected
          ? 'border-navy-900 bg-navy-900 text-white'
          : 'border-strong bg-white text-navy-900 hover:bg-navy-50',
        className,
      )}
      {...props}
    />
  );
}

const avatarTone = {
  blue: 'bg-blue-100 text-blue-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-800',
} as const;

/** Initials avatar for drivers, parents and students. */
export function Avatar({
  name,
  tone = 'blue',
  size = 'default',
  className,
}: {
  name: string;
  tone?: keyof typeof avatarTone;
  size?: 'default' | 'lg';
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-full font-bold',
        size === 'lg' ? 'size-14 text-xl' : 'size-10 text-[15px]',
        avatarTone[tone],
        className,
      )}
    >
      {initials}
    </span>
  );
}
