import { createServer } from 'node:http';
import type { ClientToServerEvents, ServerToClientEvents } from '@raad/shared';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

const app = createApp();
const httpServer = createServer(app);

export const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: '*' },
});

httpServer.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, 'Raad API listening');
});

function shutdown(signal: string): void {
  logger.info({ signal }, 'Shutting down');
  io.close();
  httpServer.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
