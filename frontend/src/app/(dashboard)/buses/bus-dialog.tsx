'use client';

import type { Bus } from '@raad/shared';
import { toast } from 'sonner';
import { FormActions, FormDialog, useDialogForm } from '@/components/fleet/form-dialog';
import {
  CheckboxField,
  Field,
  fieldAria,
  FormError,
  NativeSelect,
} from '@/components/fleet/form-parts';
import { Input } from '@/components/ui/input';
import { saveBus } from './actions';

export type BusFormOptions = {
  /** Every driver; `assignedTo` is the plate of the bus they already drive. */
  drivers: { id: string; name: string; active: boolean; assignedTo?: string; busId?: string }[];
  routes: { id: string; name: string; active: boolean; stopCount: number }[];
};

/** "Add bus" button, or the edit button on a row when `bus` is given. */
export function BusDialog({ bus, options }: { bus?: Bus; options: BusFormOptions }) {
  return (
    <FormDialog
      mode={bus ? 'edit' : 'add'}
      what="bus"
      name={bus?.plateNumber}
      title={bus ? `Edit bus ${bus.plateNumber}` : 'Add a bus'}
    >
      {(close) => <BusForm bus={bus} options={options} close={close} />}
    </FormDialog>
  );
}

function BusForm({
  bus,
  options,
  close,
}: {
  bus?: Bus;
  options: BusFormOptions;
  close: () => void;
}) {
  const { state, pending, onSubmit, errors } = useDialogForm(saveBus, () => {
    close();
    toast.success(bus ? 'Bus updated' : 'Bus added');
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {bus ? <input type="hidden" name="id" value={bus.id} /> : null}
      <FormError message={state.error} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="bus-plate" label="Plate number" error={errors.plateNumber}>
          <Input
            {...fieldAria('bus-plate', errors.plateNumber)}
            name="plateNumber"
            autoComplete="off"
            autoFocus
            className="font-mono uppercase"
            defaultValue={bus?.plateNumber}
          />
        </Field>
        <Field id="bus-capacity" label="Seats" error={errors.capacity}>
          <Input
            {...fieldAria('bus-capacity', errors.capacity)}
            name="capacity"
            type="number"
            inputMode="numeric"
            min={1}
            max={100}
            defaultValue={bus?.capacity}
          />
        </Field>
      </div>

      <Field
        id="bus-label"
        label="Name"
        optional
        hint='What people call it, e.g. "Bus 3"'
        error={errors.label}
      >
        <Input
          {...fieldAria('bus-label', errors.label, 'hint')}
          name="label"
          autoComplete="off"
          defaultValue={bus?.label}
        />
      </Field>

      <Field
        id="bus-driver"
        label="Driver"
        hint="A driver can drive only one bus."
        error={errors.driverId}
      >
        <NativeSelect
          {...fieldAria('bus-driver', errors.driverId, 'hint')}
          name="driverId"
          defaultValue={bus?.driverId ?? ''}
        >
          <option value="">No driver yet</option>
          {options.drivers.map((driver) => {
            const onOtherBus = driver.assignedTo && driver.busId !== bus?.id;
            const isCurrent = driver.id === bus?.driverId;
            const note = onOtherBus
              ? ` (drives ${driver.assignedTo})`
              : !driver.active
                ? ' (inactive)'
                : '';
            return (
              <option
                key={driver.id}
                value={driver.id}
                disabled={!isCurrent && (Boolean(onOtherBus) || !driver.active)}
              >
                {driver.name}
                {note}
              </option>
            );
          })}
        </NativeSelect>
      </Field>

      <Field id="bus-route" label="Route" error={errors.routeId}>
        <NativeSelect
          {...fieldAria('bus-route', errors.routeId)}
          name="routeId"
          defaultValue={bus?.routeId ?? ''}
        >
          <option value="">No route yet</option>
          {options.routes.map((route) => (
            <option
              key={route.id}
              value={route.id}
              disabled={!route.active && route.id !== bus?.routeId}
            >
              {route.name} ({route.stopCount} stops){route.active ? '' : ' (inactive)'}
            </option>
          ))}
        </NativeSelect>
      </Field>

      <CheckboxField
        name="active"
        label="In service"
        description="Turn off while a bus is being repaired or is not in use."
        defaultChecked={bus?.active ?? true}
      />

      <FormActions
        pending={pending}
        saveLabel={bus ? 'Save changes' : 'Add bus'}
        onCancel={close}
      />
    </form>
  );
}
