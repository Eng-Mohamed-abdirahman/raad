import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { useTestDatabase } from './helpers/database.js';

useTestDatabase();
const app = createApp();

async function createDriver(phone = '+252634000001'): Promise<string> {
  const res = await request(app).post('/api/drivers').send({ name: 'Amina', phone });
  return res.body.id;
}

async function createRoute(): Promise<string> {
  const res = await request(app)
    .post('/api/routes')
    .send({
      name: 'North Route',
      stops: [
        { name: 'A', lat: 9.57, lng: 44.07 },
        { name: 'B', lat: 9.56, lng: 44.06 },
      ],
    });
  return res.body.id;
}

describe('/api/buses', () => {
  it('creates an unassigned bus with the plate in upper case', async () => {
    const res = await request(app)
      .post('/api/buses')
      .send({ plateNumber: 'sl-123', label: 'Bus 1', capacity: 30 });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      plateNumber: 'SL-123',
      label: 'Bus 1',
      capacity: 30,
      driverId: null,
      routeId: null,
      active: true,
    });
  });

  it('assigns a driver and route, returning their ids as strings', async () => {
    const driverId = await createDriver();
    const routeId = await createRoute();

    const res = await request(app)
      .post('/api/buses')
      .send({ plateNumber: 'SL-123', capacity: 30, driverId, routeId });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ driverId, routeId });
  });

  it('rejects a driver or route that does not exist', async () => {
    const missing = '64b7f0c2a1b2c3d4e5f60718';

    const noDriver = await request(app)
      .post('/api/buses')
      .send({ plateNumber: 'SL-123', capacity: 30, driverId: missing });
    const noRoute = await request(app)
      .post('/api/buses')
      .send({ plateNumber: 'SL-124', capacity: 30, routeId: missing });

    expect(noDriver.status).toBe(400);
    expect(noDriver.body.error).toMatchObject({
      code: 'invalid_reference',
      details: { field: 'driverId' },
    });
    expect(noRoute.status).toBe(400);
    expect(noRoute.body.error.details.field).toBe('routeId');
  });

  it('does not let one driver drive two buses', async () => {
    const driverId = await createDriver();
    await request(app).post('/api/buses').send({ plateNumber: 'SL-1', capacity: 30, driverId });

    const res = await request(app)
      .post('/api/buses')
      .send({ plateNumber: 'SL-2', capacity: 30, driverId });

    expect(res.status).toBe(409);
    expect(res.body.error.details.field).toBe('driverId');
  });

  it('allows many buses without a driver', async () => {
    await request(app).post('/api/buses').send({ plateNumber: 'SL-1', capacity: 30 });
    const res = await request(app).post('/api/buses').send({ plateNumber: 'SL-2', capacity: 30 });

    expect(res.status).toBe(201);
  });

  it('rejects a duplicate plate number regardless of case', async () => {
    await request(app).post('/api/buses').send({ plateNumber: 'SL-123', capacity: 30 });
    const res = await request(app).post('/api/buses').send({ plateNumber: 'sl-123', capacity: 20 });

    expect(res.status).toBe(409);
    expect(res.body.error.details.field).toBe('plateNumber');
  });

  it('unassigns the driver when driverId is set to null', async () => {
    const driverId = await createDriver();
    const bus = await request(app)
      .post('/api/buses')
      .send({ plateNumber: 'SL-123', capacity: 30, driverId });

    const res = await request(app).patch(`/api/buses/${bus.body.id}`).send({ driverId: null });

    expect(res.status).toBe(200);
    expect(res.body.driverId).toBeNull();
    // The driver can now be deleted.
    expect((await request(app).delete(`/api/drivers/${driverId}`)).status).toBe(204);
  });

  it('rejects a non-integer capacity', async () => {
    const res = await request(app).post('/api/buses').send({ plateNumber: 'SL-1', capacity: 2.5 });

    expect(res.status).toBe(400);
    expect(res.body.error.details[0].path).toBe('capacity');
  });

  it('deletes a bus', async () => {
    const bus = await request(app).post('/api/buses').send({ plateNumber: 'SL-1', capacity: 30 });

    expect((await request(app).delete(`/api/buses/${bus.body.id}`)).status).toBe(204);
    expect((await request(app).get(`/api/buses/${bus.body.id}`)).status).toBe(404);
  });
});

describe('errors', () => {
  it('returns JSON 404 for an unknown path', async () => {
    const res = await request(app).get('/api/nothing-here');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('not_found');
  });

  it('returns 400 for malformed JSON', async () => {
    const res = await request(app)
      .post('/api/buses')
      .set('Content-Type', 'application/json')
      .send('{"plateNumber":');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('invalid_json');
  });
});
