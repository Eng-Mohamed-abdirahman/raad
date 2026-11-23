'use client';

import { startTransition, useActionState, useState, type FormEvent, type ReactNode } from 'react';
import { emptyFormState, type FormState } from '@/lib/form-state';
import { Icon } from '@/components/raad/icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * "Add" or "Edit" button that opens a dialog with a form. The form is rendered
 * only while the dialog is open, so it starts fresh every time. It gets `close`
 * to call after a successful save.
 */
export function FormDialog({
  mode,
  what,
  name,
  title,
  description,
  children,
}: {
  mode: 'add' | 'edit';
  /** e.g. "driver" */
  what: string;
  /** The record's name, for the Edit button's label. */
  name?: string;
  title: string;
  description?: string;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {mode === 'add' ? (
        <Button onClick={() => setOpen(true)}>
          <Icon name="plus" />
          Add {what}
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Edit ${name ?? what}`}
          onClick={() => setOpen(true)}
        >
          <Icon name="edit" size={18} />
        </Button>
      )}
      <DialogContent className="max-h-[calc(100svh-2rem)] gap-5 overflow-y-auto p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {open ? children(close) : null}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Runs a Server Action from a form's onSubmit. Unlike `<form action>`, this
 * doesn't reset the form, so what the admin typed stays when the server
 * rejects it. Calls `onSuccess` when the action returns ok.
 */
export function useDialogForm(
  action: (prev: FormState, formData: FormData) => Promise<FormState>,
  onSuccess: () => void,
) {
  const [state, dispatch, pending] = useActionState(async (prev: FormState, formData: FormData) => {
    const result = await action(prev, formData);
    if (result.ok) onSuccess();
    return result;
  }, emptyFormState);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  }

  return { state, pending, onSubmit, errors: state.fieldErrors ?? {} };
}

/** Cancel and Save buttons at the bottom of a dialog form. */
export function FormActions({
  pending,
  saveLabel,
  onCancel,
}: {
  pending: boolean;
  saveLabel: string;
  onCancel: () => void;
}) {
  return (
    <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : saveLabel}
      </Button>
    </div>
  );
}
