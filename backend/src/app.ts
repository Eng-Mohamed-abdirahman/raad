import compression from 'compression';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { logger } from './lib/logger.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { requireAdmin } from './middleware/require-admin.js';
import { createAuthRouter } from './modules/auth/auth.router.js';
import { busesRouter } from './modules/buses/buses.router.js';
import { driversRouter } from './modules/drivers/drivers.router.js';
import { routesRouter } from './modules/routes/routes.router.js';

/** Builds the Express app without listening, so tests can call it directly. */
export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json({ limit: '100kb' }));
  app.use(pinoHttp({ logger }));

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/auth', createAuthRouter());

  // Everything below needs a signed-in admin.
  app.use('/api/drivers', requireAdmin, driversRouter);
  app.use('/api/routes', requireAdmin, routesRouter);
  app.use('/api/buses', requireAdmin, busesRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
