import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DeleteButton } from '@/components/fleet/delete-button';
import { ActiveBadge } from '@/components/fleet/form-parts';
import { EmptyState, PageHeader, TableCard, TableSkeleton } from '@/components/fleet/page-parts';
import { Icon } from '@/components/raad/icon';
import { PlateTag } from '@/components/raad/tags';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getBuses, getRoutes } from '@/lib/fleet';
import { deleteRoute } from './actions';
import { RouteDialog } from './route-dialog';

export const metadata: Metadata = { title: 'Routes · Raad Admin' };

export default function RoutesPage() {
  return (
    <>
      <PageHeader
        title="Routes"
        description="Each route is an ordered list of stops. Give a route to a bus on the Buses page."
        action={<RouteDialog />}
      />
      <Suspense fallback={<TableSkeleton />}>
        <RoutesTable />
      </Suspense>
    </>
  );
}

async function RoutesTable() {
  const [routes, buses] = await Promise.all([getRoutes(), getBuses()]);

  if (routes.length === 0) {
    return (
      <EmptyState
        icon="route"
        title="No routes yet"
        description="Add a route with its stops in the order the bus visits them."
        action={<RouteDialog />}
      />
    );
  }

  return (
    <TableCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-5">Route</TableHead>
            <TableHead>Stops</TableHead>
            <TableHead>Buses</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-5 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.map((route) => {
            const routeBuses = buses.filter((b) => b.routeId === route.id);
            const first = route.stops[0];
            const last = route.stops.at(-1);
            return (
              <TableRow key={route.id}>
                <TableCell className="py-3 pl-5 font-semibold text-primary">{route.name}</TableCell>
                <TableCell>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-medium tabular">{route.stops.length} stops</span>
                    {first && last ? (
                      <span className="flex items-center gap-1 text-caption text-muted">
                        {first.name}
                        <Icon name="arrow-r" size={12} />
                        {last.name}
                      </span>
                    ) : null}
                  </span>
                </TableCell>
                <TableCell>
                  {routeBuses.length ? (
                    <span className="flex flex-wrap gap-1">
                      {routeBuses.map((b) => (
                        <PlateTag key={b.id}>{b.plateNumber}</PlateTag>
                      ))}
                    </span>
                  ) : (
                    <span className="text-muted">No bus</span>
                  )}
                </TableCell>
                <TableCell>
                  <ActiveBadge active={route.active} />
                </TableCell>
                <TableCell className="pr-5">
                  <span className="flex justify-end gap-1">
                    <RouteDialog route={route} />
                    <DeleteButton
                      what="route"
                      name={route.name}
                      action={deleteRoute.bind(null, route.id)}
                    />
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableCard>
  );
}
