'use client';

import type { Driver } from '@raad/shared';
import { toast } from 'sonner';
import { FormActions, FormDialog, useDialogForm } from '@/components/fleet/form-dialog';
import { CheckboxField, Field, fieldAria, FormError } from '@/components/fleet/form-parts';
import { Input } from '@/components/ui/input';
import { saveDriver } from './actions';

/** "Add driver" button, or the edit button on a row when `driver` is given. */
export function DriverDialog({ driver }: { driver?: Driver }) {
  return (
    <FormDialog
      mode={driver ? 'edit' : 'add'}
      what="driver"
      name={driver?.name}
      title={driver ? 'Edit driver' : 'Add a driver'}
      description="Drivers sign in to the driver app with this phone number."
    >
      {(close) => <DriverForm driver={driver} close={close} />}
    </FormDialog>
  );
}

function DriverForm({ driver, close }: { driver?: Driver; close: () => void }) {
  const { state, pending, onSubmit, errors } = useDialogForm(saveDriver, () => {
    close();
    toast.success(driver ? 'Driver updated' : 'Driver added');
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {driver ? <input type="hidden" name="id" value={driver.id} /> : null}
      <FormError message={state.error} />

      <Field id="driver-name" label="Full name" error={errors.name}>
        <Input
          {...fieldAria('driver-name', errors.name)}
          name="name"
          autoComplete="off"
          autoFocus
          defaultValue={driver?.name}
        />
      </Field>

      <Field
        id="driver-phone"
        label="Phone number"
        hint="With the country code, e.g. +252 63 4123456"
        error={errors.phone}
      >
        <Input
          {...fieldAria('driver-phone', errors.phone, 'hint')}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="off"
          defaultValue={driver?.phone}
        />
      </Field>

      <Field
        id="driver-license"
        label="Driving licence number"
        optional
        error={errors.licenseNumber}
      >
        <Input
          {...fieldAria('driver-license', errors.licenseNumber)}
          name="licenseNumber"
          autoComplete="off"
          defaultValue={driver?.licenseNumber}
        />
      </Field>

      <CheckboxField
        name="active"
        label="Active"
        description="Inactive drivers stay on record but can't be given a bus."
        defaultChecked={driver?.active ?? true}
      />

      <FormActions
        pending={pending}
        saveLabel={driver ? 'Save changes' : 'Add driver'}
        onCancel={close}
      />
    </form>
  );
}
