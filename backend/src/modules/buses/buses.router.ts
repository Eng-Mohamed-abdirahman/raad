import { BusInput, BusUpdate } from '@raad/shared';
import { Router } from 'express';
import { HttpError, notFound } from '../../lib/http-error.js';
import { parseBody, parseId } from '../../lib/validate.js';
import { DriverModel } from '../drivers/driver.model.js';
import { RouteModel } from '../routes/route.model.js';
import { BusModel } from './bus.model.js';

export const busesRouter = Router();

/** Rejects a driverId or routeId that points at no record. */
async function checkReferences(input: { driverId?: string | null; routeId?: string | null }) {
  if (input.driverId && !(await DriverModel.exists({ _id: input.driverId }))) {
    throw new HttpError(400, 'invalid_reference', 'The chosen driver does not exist', {
      field: 'driverId',
    });
  }
  if (input.routeId && !(await RouteModel.exists({ _id: input.routeId }))) {
    throw new HttpError(400, 'invalid_reference', 'The chosen route does not exist', {
      field: 'routeId',
    });
  }
}

busesRouter.get('/', async (_req, res) => {
  const buses = await BusModel.find().sort({ plateNumber: 1 });
  res.json(buses);
});

busesRouter.get('/:id', async (req, res) => {
  const bus = await BusModel.findById(parseId(req.params.id, 'Bus'));
  if (!bus) throw notFound('Bus');
  res.json(bus);
});

busesRouter.post('/', async (req, res) => {
  const input = parseBody(BusInput, req.body);
  await checkReferences(input);
  const bus = await BusModel.create(input);
  res.status(201).json(bus);
});

busesRouter.patch('/:id', async (req, res) => {
  const id = parseId(req.params.id, 'Bus');
  const update = parseBody(BusUpdate, req.body);
  await checkReferences(update);
  const bus = await BusModel.findByIdAndUpdate(id, update, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!bus) throw notFound('Bus');
  res.json(bus);
});

busesRouter.delete('/:id', async (req, res) => {
  const bus = await BusModel.findByIdAndDelete(parseId(req.params.id, 'Bus'));
  if (!bus) throw notFound('Bus');
  res.status(204).end();
});
