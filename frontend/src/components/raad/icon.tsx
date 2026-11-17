import { cn } from 'cn';
import { iconPaths, type IconName } from '../icons/icon-paths';

type IconProps = {
  name: IconName;
  /** Pixel size. The design uses 16, 18, 20, 24 (default), 28 and 32. */
  size?: number;
  /** Accessible name. Leave it out for decorative icons next to text. */
  title?: string;
  className?: string;
};

/** A Raad UI icon: 24×24 grid, 2px round stroke, coloured with currentColor. */
export function Icon({ name, size = 24, title, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      // Icon markup is static and comes from the design system (shared/design/icons.json).
      dangerouslySetInnerHTML={{ __html: iconPaths[name] }}
    />
  );
}

export type { IconName };
