import { createServer } from 'node:http';
import type { ClientToServerEvents, ServerToClientEvents } from '@raad/shared';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabases, disconnectDatabases } from './lib/databases.js';
import { logger } from './lib/logger.js';

const app = createApp();
const httpServer = createServer(app);

export const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: '*' },
});

async function start(): Promise<void> {
  await connectDatabases();

  httpServer.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, 'Raad API listening');
  });
}

void start().catch((error: unknown) => {
  logger.fatal({ error }, 'Failed to start Raad API');
  process.exitCode = 1;
});

async function shutdown(signal: string): Promise<void> {
  logger.info({ signal }, 'Shutting down');
  io.close();
  await disconnectDatabases();
  httpServer.close(() => process.exit(0));
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
