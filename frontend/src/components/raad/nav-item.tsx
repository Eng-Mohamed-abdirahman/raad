import { cn } from 'cn';
import Link from 'next/link';
import { Icon, type IconName } from './icon';

type NavItemProps = {
  href: string;
  icon: IconName;
  label: string;
  active?: boolean;
  className?: string;
};

/** Admin sidebar link on the navy sidebar. The active item gets a yellow icon. */
export function NavItem({ href, icon, label, active = false, className }: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex h-11 items-center gap-3 rounded-[10px] px-3 text-[14.5px] no-underline transition-colors outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
        active
          ? 'bg-navy-700 font-semibold text-white'
          : 'font-medium text-navy-100 hover:bg-navy-800',
        className,
      )}
    >
      <Icon name={icon} size={20} className={active ? 'text-yellow-400' : undefined} />
      <span>{label}</span>
    </Link>
  );
}
