import { cn } from 'cn';

type MarkProps = {
  /** `yellow`: yellow tile + navy trail (parent app, default). `navy`: navy tile + yellow trail (driver app, on yellow). */
  tile?: 'yellow' | 'navy';
  size?: number;
  className?: string;
};

const YELLOW = 'var(--yellow-400)';
const NAVY = 'var(--navy-900)';

/**
 * The Raad mark: three dots (the bus's trail) leading to a pin (your stop).
 * Keep the colours fixed. Never stretch, outline, shadow or recolour it. Minimum size 24px.
 */
export function RaadMark({ tile = 'yellow', size = 36, className }: MarkProps) {
  const bg = tile === 'yellow' ? YELLOW : NAVY;
  const fg = tile === 'yellow' ? NAVY : YELLOW;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Raad"
      className={cn('shrink-0', className)}
    >
      <rect width="48" height="48" rx="13" fill={bg} />
      <circle cx="11" cy="37" r="2.6" fill={fg} />
      <circle cx="17.5" cy="32.5" r="2.6" fill={fg} />
      <circle cx="23" cy="27" r="2.6" fill={fg} />
      <path d="M32 30s-7.5-6.2-7.5-12a7.5 7.5 0 0 1 15 0c0 5.8-7.5 12-7.5 12z" fill={fg} />
      <circle cx="32" cy="18" r="2.8" fill={bg} />
    </svg>
  );
}

type LogoProps = {
  /** `onLight`: navy wordmark for cream/white. `onDark`: white wordmark for navy. `onYellow`: navy tile, navy wordmark. */
  surface?: 'onLight' | 'onDark' | 'onYellow';
  /** Mark size in px. The wordmark scales with it. Full lockup minimum is 96px wide. */
  size?: number;
  className?: string;
};

/** Mark + lowercase "raad" wordmark (Outfit 700, tracking −3%). */
export function RaadLogo({ surface = 'onLight', size = 36, className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center', className)} style={{ gap: size * 0.28 }}>
      <RaadMark tile={surface === 'onYellow' ? 'navy' : 'yellow'} size={size} />
      <span
        aria-hidden="true"
        className={cn(
          'font-display leading-none font-bold tracking-[-0.03em]',
          surface === 'onDark' ? 'text-white' : 'text-navy-900',
        )}
        style={{ fontSize: size * 0.9 }}
      >
        raad
      </span>
    </span>
  );
}
