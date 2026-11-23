import type { Bus, Driver, Route } from '@raad/shared';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DeleteButton } from '@/components/fleet/delete-button';
import { EmptyState, PageHeader, TableCard, TableSkeleton } from '@/components/fleet/page-parts';
import { Icon } from '@/components/raad/icon';
import { PlateTag } from '@/components/raad/tags';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getBuses, getDrivers, getRoutes } from '@/lib/fleet';
import { deleteBus } from './actions';
import { BusDialog, type BusFormOptions } from './bus-dialog';

export const metadata: Metadata = { title: 'Buses · Raad Admin' };

export default function BusesPage() {
  return (
    <>
      <PageHeader
        title="Buses"
        description="Every school bus, with the driver who drives it and the route it runs."
        action={
          <Suspense
            fallback={
              <Button disabled>
                <Icon name="plus" />
                Add bus
              </Button>
            }
          >
            <AddBusButton />
          </Suspense>
        }
      />
      <Suspense fallback={<TableSkeleton />}>
        <BusesTable />
      </Suspense>
    </>
  );
}

async function loadFleet() {
  const [buses, drivers, routes] = await Promise.all([getBuses(), getDrivers(), getRoutes()]);
  return { buses, drivers, routes, options: formOptions(buses, drivers, routes) };
}

/** Only what the form's pickers need, so the full records don't go to the browser. */
function formOptions(buses: Bus[], drivers: Driver[], routes: Route[]): BusFormOptions {
  const busByDriver = new Map(buses.filter((b) => b.driverId).map((b) => [b.driverId, b]));
  return {
    drivers: drivers.map((d) => ({
      id: d.id,
      name: d.name,
      active: d.active,
      assignedTo: busByDriver.get(d.id)?.plateNumber,
      busId: busByDriver.get(d.id)?.id,
    })),
    routes: routes.map((r) => ({
      id: r.id,
      name: r.name,
      active: r.active,
      stopCount: r.stops.length,
    })),
  };
}

async function AddBusButton() {
  const { options } = await loadFleet();
  return <BusDialog options={options} />;
}

async function BusesTable() {
  const { buses, drivers, routes, options } = await loadFleet();

  if (buses.length === 0) {
    return (
      <EmptyState
        icon="bus"
        title="No buses yet"
        description="Add your buses, then give each one a driver and a route."
        action={<BusDialog options={options} />}
      />
    );
  }

  const driverName = new Map(drivers.map((d) => [d.id, d.name]));
  const routeName = new Map(routes.map((r) => [r.id, r.name]));

  return (
    <TableCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-5">Bus</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-5 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buses.map((bus) => (
            <TableRow key={bus.id}>
              <TableCell className="py-3 pl-5">
                <span className="flex items-center gap-3">
                  <PlateTag>{bus.plateNumber}</PlateTag>
                  {bus.label ? (
                    <span className="font-semibold text-primary">{bus.label}</span>
                  ) : null}
                </span>
              </TableCell>
              <TableCell className="tabular">{bus.capacity}</TableCell>
              <TableCell>
                {bus.driverId ? driverName.get(bus.driverId) : <Missing>No driver</Missing>}
              </TableCell>
              <TableCell>
                {bus.routeId ? routeName.get(bus.routeId) : <Missing>No route</Missing>}
              </TableCell>
              <TableCell>
                <span
                  className={
                    bus.active
                      ? 'inline-flex h-7 items-center gap-1.5 rounded-pill bg-blue-50 pr-2.5 pl-2 text-[13px] font-semibold text-blue-800'
                      : 'inline-flex h-7 items-center gap-1.5 rounded-pill bg-sand-200 pr-2.5 pl-2 text-[13px] font-semibold text-navy-600'
                  }
                >
                  <Icon name={bus.active ? 'check-c' : 'stop'} size={16} />
                  {bus.active ? 'In service' : 'Out of service'}
                </span>
              </TableCell>
              <TableCell className="pr-5">
                <span className="flex justify-end gap-1">
                  <BusDialog bus={bus} options={options} />
                  <DeleteButton
                    what="bus"
                    name={bus.plateNumber}
                    action={deleteBus.bind(null, bus.id)}
                  />
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableCard>
  );
}

/** A missing assignment: yellow alert icon + words, so it stands out without relying on colour. */
function Missing({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-medium text-yellow-800">
      <Icon name="alert" size={15} />
      {children}
    </span>
  );
}
