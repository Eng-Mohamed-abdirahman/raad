import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { signedInClient } from './helpers/auth.js';
import { useTestDatabase } from './helpers/database.js';

useTestDatabase();
const app = createApp();
const api = signedInClient(app);

const northRoute = {
  name: 'North Route',
  stops: [
    { name: 'Jigjiga Yar', lat: 9.5765, lng: 44.0723 },
    { name: 'Hargeisa School', lat: 9.5624, lng: 44.065 },
  ],
};

describe('/api/routes', () => {
  it('creates a route and keeps the stops in order, each with an id', async () => {
    const res = await api.post('/api/routes').send(northRoute);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ ...northRoute, active: true });
    for (const stop of res.body.stops) {
      expect(stop.id).toMatch(/^[0-9a-f]{24}$/);
      expect(stop).not.toHaveProperty('_id');
    }
  });

  it('needs at least two stops', async () => {
    const res = await api.post('/api/routes').send({ name: 'Short', stops: [northRoute.stops[0]] });

    expect(res.status).toBe(400);
    expect(res.body.error.details[0].path).toBe('stops');
  });

  it('rejects coordinates outside the valid range', async () => {
    const res = await api.post('/api/routes').send({
      name: 'Broken',
      stops: [northRoute.stops[0], { name: 'Nowhere', lat: 95, lng: 44 }],
    });

    expect(res.status).toBe(400);
    expect(res.body.error.details[0].path).toBe('stops.1.lat');
  });

  it('rejects a duplicate route name with 409', async () => {
    await api.post('/api/routes').send(northRoute);
    const res = await api.post('/api/routes').send(northRoute);

    expect(res.status).toBe(409);
    expect(res.body.error.details.field).toBe('name');
  });

  it('replaces the stop list on update', async () => {
    const created = await api.post('/api/routes').send(northRoute);
    const reversed = [...northRoute.stops].reverse();

    const res = await api.patch(`/api/routes/${created.body.id}`).send({ stops: reversed });

    expect(res.status).toBe(200);
    expect(res.body.stops.map((s: { name: string }) => s.name)).toEqual(
      reversed.map((s) => s.name),
    );
  });

  it('refuses to delete a route that a bus uses', async () => {
    const route = await api.post('/api/routes').send(northRoute);
    await api
      .post('/api/buses')
      .send({ plateNumber: 'SL-123', capacity: 30, routeId: route.body.id });

    const res = await api.delete(`/api/routes/${route.body.id}`);

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('in_use');
  });
});
