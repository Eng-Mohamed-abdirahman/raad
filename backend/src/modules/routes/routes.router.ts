import { RouteInput, RouteUpdate } from '@raad/shared';
import { Router } from 'express';
import { HttpError, notFound } from '../../lib/http-error.js';
import { parseBody, parseId } from '../../lib/validate.js';
import { BusModel } from '../buses/bus.model.js';
import { RouteModel } from './route.model.js';

export const routesRouter = Router();

routesRouter.get('/', async (_req, res) => {
  const routes = await RouteModel.find().sort({ name: 1 });
  res.json(routes);
});

routesRouter.get('/:id', async (req, res) => {
  const route = await RouteModel.findById(parseId(req.params.id, 'Route'));
  if (!route) throw notFound('Route');
  res.json(route);
});

routesRouter.post('/', async (req, res) => {
  const input = parseBody(RouteInput, req.body);
  const route = await RouteModel.create(input);
  res.status(201).json(route);
});

routesRouter.patch('/:id', async (req, res) => {
  const id = parseId(req.params.id, 'Route');
  const update = parseBody(RouteUpdate, req.body);
  const route = await RouteModel.findByIdAndUpdate(id, update, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!route) throw notFound('Route');
  res.json(route);
});

routesRouter.delete('/:id', async (req, res) => {
  const id = parseId(req.params.id, 'Route');
  if (await BusModel.exists({ routeId: id })) {
    throw new HttpError(409, 'in_use', 'Unassign this route from every bus before deleting it');
  }
  const route = await RouteModel.findByIdAndDelete(id);
  if (!route) throw notFound('Route');
  res.status(204).end();
});
