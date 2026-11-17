import { cn } from 'cn';
import type { ReactNode } from 'react';
import { Icon } from './icon';
import { statusTokens, type Status } from './status-tokens';

// Full class names so Tailwind can find them. Colours come from the status tokens.
const statusClass: Record<Status, string> = {
  idle: 'bg-status-idle-bg text-status-idle-fg',
  way: 'bg-status-way-bg text-status-way-fg',
  soon: 'bg-status-soon-bg text-status-soon-fg',
  done: 'bg-status-done-bg text-status-done-fg',
  late: 'bg-status-late-bg text-status-late-fg',
  off: 'bg-status-off-bg text-status-off-fg',
  sos: 'bg-status-sos-bg text-status-sos-fg',
};

type StatusPillProps = {
  status: Status;
  /** The words shown. Defaults to the English label; pass detail such as "Delayed 8 min". */
  children?: ReactNode;
  size?: 'default' | 'lg';
  className?: string;
};

/**
 * Trip/bus status. Always icon + word + colour, so status never relies on colour alone.
 * Green is only for done/arrived; red only for late and SOS.
 */
export function StatusPill({ status, children, size = 'default', className }: StatusPillProps) {
  const token = statusTokens[status];
  return (
    <span
      data-status={status}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill font-semibold whitespace-nowrap',
        size === 'lg' ? 'h-9 pr-3.5 pl-2.5 text-[15px]' : 'h-7 pr-2.5 pl-2 text-[13px]',
        statusClass[status],
        className,
      )}
    >
      <Icon name={token.icon} size={16} />
      {children ?? token.en}
    </span>
  );
}

export { statusTokens, type Status };
