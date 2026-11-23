import Link from 'next/link';
import { Suspense } from 'react';
import { Icon, type IconName } from '@/components/raad/icon';
import { getCurrentAdmin } from '@/lib/auth';
import { getBuses, getDrivers, getRoutes } from '@/lib/fleet';

export default function OverviewPage() {
  return (
    <>
      <div className="flex flex-col gap-1">
        <Suspense fallback={<h1 className="text-admin-h1">Welcome</h1>}>
          <Greeting />
        </Suspense>
        <p className="text-small text-secondary">
          Set up your fleet here. The live map comes once buses start sending their position.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-[16px] bg-sand-100" />
            ))}
          </div>
        }
      >
        <FleetSummary />
      </Suspense>
    </>
  );
}

async function Greeting() {
  const admin = await getCurrentAdmin();
  return <h1 className="text-admin-h1">Welcome, {admin.name.split(' ')[0]}</h1>;
}

async function FleetSummary() {
  const [buses, drivers, routes] = await Promise.all([getBuses(), getDrivers(), getRoutes()]);
  const withoutDriver = buses.filter((b) => !b.driverId).length;
  const withoutRoute = buses.filter((b) => !b.routeId).length;
  const activeDrivers = drivers.filter((d) => d.active).length;
  const stops = routes.reduce((sum, r) => sum + r.stops.length, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <SummaryCard
        href="/buses"
        icon="bus"
        label="Buses"
        count={buses.length}
        detail={
          buses.length === 0
            ? 'Add your first bus'
            : withoutDriver || withoutRoute
              ? [
                  withoutDriver ? `${withoutDriver} without a driver` : null,
                  withoutRoute ? `${withoutRoute} without a route` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')
              : 'All have a driver and a route'
        }
        attention={withoutDriver + withoutRoute > 0}
      />
      <SummaryCard
        href="/drivers"
        icon="driver"
        label="Drivers"
        count={drivers.length}
        detail={drivers.length === 0 ? 'Add your first driver' : `${activeDrivers} active`}
      />
      <SummaryCard
        href="/routes"
        icon="route"
        label="Routes"
        count={routes.length}
        detail={routes.length === 0 ? 'Add your first route' : `${stops} stops in total`}
      />
    </div>
  );
}

function SummaryCard({
  href,
  icon,
  label,
  count,
  detail,
  attention = false,
}: {
  href: string;
  icon: IconName;
  label: string;
  count: number;
  detail: string;
  attention?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-[16px] border border-subtle bg-surface p-5 no-underline transition-colors outline-none hover:border-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      <span className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-small font-semibold text-secondary">
          <Icon name={icon} size={20} />
          {label}
        </span>
        <Icon
          name="arrow-r"
          size={18}
          className="text-navy-400 transition-transform group-hover:translate-x-0.5"
        />
      </span>
      <span className="text-kpi text-primary tabular">{count}</span>
      <span
        className={
          attention
            ? 'flex items-center gap-1.5 text-caption font-semibold text-yellow-800'
            : 'text-caption text-muted'
        }
      >
        {attention ? <Icon name="alert" size={14} /> : null}
        {detail}
      </span>
    </Link>
  );
}
