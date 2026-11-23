import { DriverInput, DriverUpdate } from '@raad/shared';
import { Router } from 'express';
import { HttpError, notFound } from '../../lib/http-error.js';
import { parseBody, parseId } from '../../lib/validate.js';
import { BusModel } from '../buses/bus.model.js';
import { DriverModel } from './driver.model.js';

export const driversRouter = Router();

driversRouter.get('/', async (_req, res) => {
  const drivers = await DriverModel.find().sort({ name: 1 });
  res.json(drivers);
});

driversRouter.get('/:id', async (req, res) => {
  const driver = await DriverModel.findById(parseId(req.params.id, 'Driver'));
  if (!driver) throw notFound('Driver');
  res.json(driver);
});

driversRouter.post('/', async (req, res) => {
  const input = parseBody(DriverInput, req.body);
  const driver = await DriverModel.create(input);
  res.status(201).json(driver);
});

driversRouter.patch('/:id', async (req, res) => {
  const id = parseId(req.params.id, 'Driver');
  const update = parseBody(DriverUpdate, req.body);
  const driver = await DriverModel.findByIdAndUpdate(id, update, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!driver) throw notFound('Driver');
  res.json(driver);
});

driversRouter.delete('/:id', async (req, res) => {
  const id = parseId(req.params.id, 'Driver');
  if (await BusModel.exists({ driverId: id })) {
    throw new HttpError(409, 'in_use', 'Unassign this driver from their bus before deleting them');
  }
  const driver = await DriverModel.findByIdAndDelete(id);
  if (!driver) throw notFound('Driver');
  res.status(204).end();
});
