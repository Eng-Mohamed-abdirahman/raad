'use server';

import { formString, type FormState } from '@/lib/form-state';
import { sendToApi } from '@/lib/mutate';

type StopFields = { name: string; lat: string; lng: string };

/** "" stays null so the API reports it as missing, instead of reading it as 0. */
function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const number = Number(trimmed);
  return Number.isFinite(number) ? number : null;
}

/** The API's messages for coordinates are terse; say what to type instead. */
const COORDINATE_HINTS = {
  lat: 'Enter a latitude between -90 and 90, e.g. 9.5624',
  lng: 'Enter a longitude between -180 and 180, e.g. 44.0650',
} as const;

export async function saveRoute(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = formString(formData, 'id');

  let stops: StopFields[];
  try {
    stops = JSON.parse(formString(formData, 'stops') || '[]') as StopFields[];
  } catch {
    return { error: 'The stop list could not be read. Reload the page and try again.' };
  }

  const body = {
    name: formString(formData, 'name'),
    active: formData.get('active') === 'on',
    stops: stops.map((stop) => ({
      name: String(stop.name ?? '').trim(),
      lat: toNumber(String(stop.lat ?? '')),
      lng: toNumber(String(stop.lng ?? '')),
    })),
  };

  const result = id
    ? await sendToApi('PATCH', `/api/routes/${encodeURIComponent(id)}`, body)
    : await sendToApi('POST', '/api/routes', body);

  if (result.fieldErrors) {
    for (const key of Object.keys(result.fieldErrors)) {
      const coordinate = /^stops\.\d+\.(lat|lng)$/.exec(key)?.[1] as 'lat' | 'lng' | undefined;
      if (coordinate) result.fieldErrors[key] = COORDINATE_HINTS[coordinate];
      if (/^stops\.\d+\.name$/.test(key)) result.fieldErrors[key] = 'Give this stop a name';
    }
  }
  return result;
}

export async function deleteRoute(id: string): Promise<FormState> {
  return sendToApi('DELETE', `/api/routes/${encodeURIComponent(id)}`);
}
