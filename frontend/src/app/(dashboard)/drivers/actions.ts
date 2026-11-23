'use server';

import { formString, type FormState } from '@/lib/form-state';
import { sendToApi } from '@/lib/mutate';

export async function saveDriver(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = formString(formData, 'id');
  const licenseNumber = formString(formData, 'licenseNumber');
  const body = {
    name: formString(formData, 'name'),
    // Accept "+252 63 412-3456" as typed; the API wants digits only.
    phone: formString(formData, 'phone').replace(/[\s()-]/g, ''),
    // On edit, an empty value clears the licence; on create it is left out.
    licenseNumber: licenseNumber || (id ? '' : undefined),
    active: formData.get('active') === 'on',
  };
  return id
    ? sendToApi('PATCH', `/api/drivers/${encodeURIComponent(id)}`, body)
    : sendToApi('POST', '/api/drivers', body);
}

export async function deleteDriver(id: string): Promise<FormState> {
  return sendToApi('DELETE', `/api/drivers/${encodeURIComponent(id)}`);
}
