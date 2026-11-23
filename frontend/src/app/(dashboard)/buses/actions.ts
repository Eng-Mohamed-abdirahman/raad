'use server';

import { formString, type FormState } from '@/lib/form-state';
import { sendToApi } from '@/lib/mutate';

export async function saveBus(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = formString(formData, 'id');
  const label = formString(formData, 'label');
  const capacity = formString(formData, 'capacity');
  const body = {
    plateNumber: formString(formData, 'plateNumber'),
    // On edit, an empty value clears the label; on create it is left out.
    label: label || (id ? '' : undefined),
    // "" stays null so the API reports it as missing.
    capacity: capacity === '' ? null : Number(capacity),
    // "" is the "No driver" / "No route" option.
    driverId: formString(formData, 'driverId') || null,
    routeId: formString(formData, 'routeId') || null,
    active: formData.get('active') === 'on',
  };

  const result = id
    ? await sendToApi('PATCH', `/api/buses/${encodeURIComponent(id)}`, body)
    : await sendToApi('POST', '/api/buses', body);

  if (result.fieldErrors?.capacity) {
    result.fieldErrors.capacity = 'Enter the number of seats, from 1 to 100';
  }
  return result;
}

export async function deleteBus(id: string): Promise<FormState> {
  return sendToApi('DELETE', `/api/buses/${encodeURIComponent(id)}`);
}
