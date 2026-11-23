/** What a form's Server Action returns to useActionState. Safe to import in client code. */
export type FormState = {
  ok?: boolean;
  /** Shown above the form or in a toast. */
  error?: string;
  /** Messages by field path, e.g. `name` or `stops.1.lat`. */
  fieldErrors?: Record<string, string>;
};

export const emptyFormState: FormState = {};

/** Reads a trimmed string field from FormData. */
export function formString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}
