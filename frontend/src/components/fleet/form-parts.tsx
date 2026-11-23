import { cn } from 'cn';
import type { ComponentProps, ReactNode } from 'react';
import { Icon } from '@/components/raad/icon';
import { Label } from '@/components/ui/label';

/** Label, control and an optional hint or error, wired together for screen readers. */
export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id}>
        {label}
        {optional ? <span className="font-normal text-muted">(optional)</span> : null}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-caption text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-caption text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** aria props for a control inside <Field>. */
export function fieldAria(id: string, error?: string, hint?: string) {
  return {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  } as const;
}

/** A native <select> styled like the Raad Input. */
export function NativeSelect({ className, ...props }: ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select
        className={cn(
          'h-13 w-full appearance-none rounded-[12px] border-[1.5px] border-strong bg-surface pr-10 pl-4 text-base text-navy-900 outline-none focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-4 aria-invalid:ring-red-100',
          className,
        )}
        {...props}
      />
      <Icon
        name="chev-d"
        size={18}
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-navy-500"
      />
    </div>
  );
}

/** A checkbox with its label on the right, e.g. "Active". */
export function CheckboxField({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-5 shrink-0 cursor-pointer accent-navy-900"
      />
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-primary">{label}</span>
        {description ? <span className="text-caption text-muted">{description}</span> : null}
      </span>
    </label>
  );
}

/** Red box at the top of a form for an error that isn't about one field. */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-[12px] border-[1.5px] border-red-200 bg-red-50 px-4 py-3 text-small text-red-800"
    >
      {message}
    </p>
  );
}

/** Active / inactive marker for table rows: icon + word, never colour alone. */
export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center gap-1.5 rounded-pill pr-2.5 pl-2 text-[13px] font-semibold whitespace-nowrap',
        active ? 'bg-blue-50 text-blue-800' : 'bg-sand-200 text-navy-600',
      )}
    >
      <Icon name={active ? 'check-c' : 'stop'} size={16} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}
