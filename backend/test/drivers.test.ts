import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { signedInClient } from './helpers/auth.js';
import { useTestDatabase } from './helpers/database.js';

useTestDatabase();
const app = createApp();
const api = signedInClient(app);

const amina = { name: 'Amina Yusuf', phone: '+252634000001', licenseNumber: 'SL-1001' };

describe('/api/drivers', () => {
  it('creates a driver and returns it with an id', async () => {
    const res = await api.post('/api/drivers').send(amina);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ ...amina, active: true });
    expect(res.body.id).toMatch(/^[0-9a-f]{24}$/);
    expect(res.body).not.toHaveProperty('_id');
    expect(res.body).not.toHaveProperty('__v');
  });

  it('lists drivers sorted by name', async () => {
    await api.post('/api/drivers').send({ name: 'Zahra', phone: '+252634000002' });
    await api.post('/api/drivers').send(amina);

    const res = await api.get('/api/drivers');

    expect(res.status).toBe(200);
    expect(res.body.map((d: { name: string }) => d.name)).toEqual(['Amina Yusuf', 'Zahra']);
  });

  it('rejects an invalid body with every problem listed', async () => {
    const res = await api.post('/api/drivers').send({ name: '', phone: 'abc' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('validation_failed');
    const paths = res.body.error.details.map((d: { path: string }) => d.path);
    expect(paths).toEqual(expect.arrayContaining(['name', 'phone']));
  });

  it('rejects a duplicate phone number with 409', async () => {
    await api.post('/api/drivers').send(amina);
    const res = await api.post('/api/drivers').send({ ...amina, name: 'Someone Else' });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatchObject({ code: 'duplicate', details: { field: 'phone' } });
  });

  it('updates only the fields sent', async () => {
    const created = await api.post('/api/drivers').send(amina);

    const res = await api.patch(`/api/drivers/${created.body.id}`).send({ active: false });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ...amina, active: false });
  });

  it('returns 404 for a missing or malformed id', async () => {
    expect((await api.get('/api/drivers/64b7f0c2a1b2c3d4e5f60718')).status).toBe(404);
    expect((await api.get('/api/drivers/not-an-id')).status).toBe(404);
  });

  it('deletes a driver', async () => {
    const created = await api.post('/api/drivers').send(amina);

    expect((await api.delete(`/api/drivers/${created.body.id}`)).status).toBe(204);
    expect((await api.get(`/api/drivers/${created.body.id}`)).status).toBe(404);
  });

  it('refuses to delete a driver who is assigned to a bus', async () => {
    const driver = await api.post('/api/drivers').send(amina);
    await api
      .post('/api/buses')
      .send({ plateNumber: 'SL-123', capacity: 30, driverId: driver.body.id });

    const res = await api.delete(`/api/drivers/${driver.body.id}`);

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('in_use');
  });
});
