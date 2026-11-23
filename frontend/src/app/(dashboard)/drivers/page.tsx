import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DeleteButton } from '@/components/fleet/delete-button';
import { ActiveBadge } from '@/components/fleet/form-parts';
import { EmptyState, PageHeader, TableCard, TableSkeleton } from '@/components/fleet/page-parts';
import { Avatar, PlateTag } from '@/components/raad/tags';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getBuses, getDrivers } from '@/lib/fleet';
import { deleteDriver } from './actions';
import { DriverDialog } from './driver-dialog';

export const metadata: Metadata = { title: 'Drivers · Raad Admin' };

export default function DriversPage() {
  return (
    <>
      <PageHeader
        title="Drivers"
        description="Everyone who drives a school bus. Give each driver a bus on the Buses page."
        action={<DriverDialog />}
      />
      <Suspense fallback={<TableSkeleton />}>
        <DriversTable />
      </Suspense>
    </>
  );
}

async function DriversTable() {
  const [drivers, buses] = await Promise.all([getDrivers(), getBuses()]);

  if (drivers.length === 0) {
    return (
      <EmptyState
        icon="driver"
        title="No drivers yet"
        description="Add your drivers first, then give each one a bus."
        action={<DriverDialog />}
      />
    );
  }

  const busByDriver = new Map(buses.filter((b) => b.driverId).map((b) => [b.driverId, b]));

  return (
    <TableCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-5">Driver</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Licence</TableHead>
            <TableHead>Bus</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-5 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver) => {
            const bus = busByDriver.get(driver.id);
            return (
              <TableRow key={driver.id}>
                <TableCell className="py-3 pl-5">
                  <span className="flex items-center gap-3">
                    <Avatar name={driver.name} size="default" className="size-9 text-sm" />
                    <span className="font-semibold text-primary">{driver.name}</span>
                  </span>
                </TableCell>
                <TableCell className="text-mono-data">{driver.phone}</TableCell>
                <TableCell className="text-secondary">{driver.licenseNumber || '—'}</TableCell>
                <TableCell>
                  {bus ? (
                    <PlateTag>{bus.plateNumber}</PlateTag>
                  ) : (
                    <span className="text-muted">No bus</span>
                  )}
                </TableCell>
                <TableCell>
                  <ActiveBadge active={driver.active} />
                </TableCell>
                <TableCell className="pr-5">
                  <span className="flex justify-end gap-1">
                    <DriverDialog driver={driver} />
                    <DeleteButton
                      what="driver"
                      name={driver.name}
                      action={deleteDriver.bind(null, driver.id)}
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
