'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Icon } from '@/components/raad/icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { FormState } from '@/lib/form-state';
import { FormError } from './form-parts';

/** Trash button that asks before deleting. `action` is a Server Action bound to the record. */
export function DeleteButton({
  what,
  name,
  action,
}: {
  /** e.g. "driver" */
  what: string;
  /** e.g. "Amina Yusuf" */
  name: string;
  action: () => Promise<FormState>;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function confirm() {
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        setOpen(false);
        toast.success(`Deleted ${name}`);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setError(undefined);
      }}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Delete ${name}`}
        className="text-red-700 hover:bg-red-50"
        onClick={() => setOpen(true)}
      >
        <Icon name="trash" size={18} />
      </Button>
      <DialogContent className="gap-5 p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete this {what}?</DialogTitle>
          <DialogDescription>
            {name} will be removed for good. This can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <FormError message={error} />
        <DialogFooter className="-mx-6 -mb-6 bg-sand-50 px-6">
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button variant="danger" disabled={pending} onClick={confirm}>
            {pending ? 'Deleting…' : `Delete ${what}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
