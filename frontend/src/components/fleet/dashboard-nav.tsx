'use client';

import { cn } from 'cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '@/components/raad/icon';
import { NavItem } from '@/components/raad/nav-item';

const LINKS: { href: string; label: string; icon: IconName }[] = [
  { href: '/', label: 'Overview', icon: 'home' },
  { href: '/buses', label: 'Buses', icon: 'bus' },
  { href: '/drivers', label: 'Drivers', icon: 'driver' },
  { href: '/routes', label: 'Routes', icon: 'route' },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

/** Navy sidebar links, shown from the md breakpoint up. */
export function SidebarNav() {
  const isActive = useIsActive();
  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {LINKS.map((link) => (
        <NavItem key={link.href} {...link} active={isActive(link.href)} />
      ))}
    </nav>
  );
}

/** Scrollable tab bar for small screens, where the sidebar is hidden. */
export function MobileNav() {
  const isActive = useIsActive();
  return (
    <nav
      aria-label="Main"
      className="flex gap-1 overflow-x-auto border-b border-subtle bg-surface px-3 md:hidden"
    >
      {LINKS.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-semibold no-underline',
              active
                ? 'border-yellow-400 text-navy-900'
                : 'border-transparent text-navy-500 hover:text-navy-900',
            )}
          >
            <Icon name={link.icon} size={18} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
