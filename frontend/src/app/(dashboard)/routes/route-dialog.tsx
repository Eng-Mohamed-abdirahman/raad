'use client';

import type { Route } from '@raad/shared';
import { cn } from 'cn';
import { useState, type ClipboardEvent } from 'react';
import { toast } from 'sonner';
import { FormActions, FormDialog, useDialogForm } from '@/components/fleet/form-dialog';
import { CheckboxField, Field, fieldAria, FormError } from '@/components/fleet/form-parts';
import { Icon } from '@/components/raad/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveRoute } from './actions';

type StopRow = { key: number; name: string; lat: string; lng: string };

let nextKey = 0;
const blankStop = (): StopRow => ({ key: nextKey++, name: '', lat: '', lng: '' });

/** "Add route" button, or the edit button on a row when `route` is given. */
export function RouteDialog({ route }: { route?: Route }) {
  return (
    <FormDialog
      mode={route ? 'edit' : 'add'}
      what="route"
      name={route?.name}
      title={route ? 'Edit route' : 'Add a route'}
      description="List the stops in the order the bus reaches them."
    >
      {(close) => <RouteForm route={route} close={close} />}
    </FormDialog>
  );
}

function RouteForm({ route, close }: { route?: Route; close: () => void }) {
  const [stops, setStops] = useState<StopRow[]>(() =>
    route
      ? route.stops.map((s) => ({
          key: nextKey++,
          name: s.name,
          lat: String(s.lat),
          lng: String(s.lng),
        }))
      : [blankStop(), blankStop()],
  );
  const { state, pending, onSubmit, errors } = useDialogForm(saveRoute, () => {
    close();
    toast.success(route ? 'Route updated' : 'Route added');
  });

  const update = (key: number, patch: Partial<StopRow>) =>
    setStops((rows) => rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  const move = (index: number, by: -1 | 1) =>
    setStops((rows) => {
      const next = [...rows];
      const [row] = next.splice(index, 1);
      if (row) next.splice(index + by, 0, row);
      return next;
    });

  /** Pasting "9.5624, 44.0650" (as copied from Google Maps) fills both boxes. */
  function pasteCoordinates(key: number, event: ClipboardEvent<HTMLInputElement>) {
    const match = /^\s*(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)\s*$/.exec(
      event.clipboardData.getData('text'),
    );
    if (match) {
      event.preventDefault();
      update(key, { lat: match[1], lng: match[2] });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {route ? <input type="hidden" name="id" value={route.id} /> : null}
      <input
        type="hidden"
        name="stops"
        value={JSON.stringify(stops.map(({ name, lat, lng }) => ({ name, lat, lng })))}
      />
      <FormError message={state.error} />

      <Field
        id="route-name"
        label="Route name"
        hint="e.g. North route or Jigjiga Yar morning"
        error={errors.name}
      >
        <Input
          {...fieldAria('route-name', errors.name, 'hint')}
          name="name"
          autoComplete="off"
          autoFocus
          defaultValue={route?.name}
        />
      </Field>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 flex flex-col gap-1">
          <span className="text-sm font-medium">Stops, in order</span>
          <span className="text-caption text-muted">
            Tip: right-click a place in Google Maps, click the coordinates to copy them, and paste
            into Latitude.
          </span>
        </legend>
        {errors.stops ? <p className="text-caption text-red-700">{errors.stops}</p> : null}

        <ol className="flex flex-col gap-3">
          {stops.map((stop, index) => {
            const error = (field: string) => errors[`stops.${index}.${field}`];
            const id = (field: string) => `stop-${stop.key}-${field}`;
            return (
              <li
                key={stop.key}
                className="flex flex-col gap-3 rounded-[12px] border border-subtle bg-sand-50 p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-navy-900 text-xs font-bold text-yellow-300 tabular">
                    {index + 1}
                  </span>
                  <Input
                    {...fieldAria(id('name'), error('name'))}
                    aria-label={`Stop ${index + 1} name`}
                    placeholder="Stop name"
                    className="h-11"
                    value={stop.name}
                    onChange={(e) => update(stop.key, { name: e.target.value })}
                  />
                  <span className="flex shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Move stop ${index + 1} up`}
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <Icon name="chev-d" size={18} className="rotate-180" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Move stop ${index + 1} down`}
                      disabled={index === stops.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <Icon name="chev-d" size={18} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove stop ${index + 1}`}
                      className="text-red-700 hover:bg-red-50"
                      onClick={() => setStops((rows) => rows.filter((r) => r.key !== stop.key))}
                    >
                      <Icon name="trash" size={18} />
                    </Button>
                  </span>
                </div>
                {error('name') ? (
                  <p id={`${id('name')}-error`} className="-mt-1 pl-9 text-caption text-red-700">
                    {error('name')}
                  </p>
                ) : null}
                <div className="grid grid-cols-2 gap-2 pl-9">
                  {(['lat', 'lng'] as const).map((field) => (
                    <div key={field} className="flex flex-col gap-1">
                      <Input
                        {...fieldAria(id(field), error(field))}
                        aria-label={`Stop ${index + 1} ${field === 'lat' ? 'latitude' : 'longitude'}`}
                        placeholder={field === 'lat' ? 'Latitude' : 'Longitude'}
                        inputMode="decimal"
                        className={cn('h-11 font-mono text-sm')}
                        value={stop[field]}
                        onChange={(e) => update(stop.key, { [field]: e.target.value })}
                        onPaste={(e) => pasteCoordinates(stop.key, e)}
                      />
                      {error(field) ? (
                        <p id={`${id(field)}-error`} className="text-caption text-red-700">
                          {error(field)}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => setStops((rows) => [...rows, blankStop()])}
        >
          <Icon name="plus" />
          Add stop
        </Button>
      </fieldset>

      <CheckboxField
        name="active"
        label="Active"
        description="Inactive routes stay on record for later."
        defaultChecked={route?.active ?? true}
      />

      <FormActions
        pending={pending}
        saveLabel={route ? 'Save changes' : 'Add route'}
        onCancel={close}
      />
    </form>
  );
}
