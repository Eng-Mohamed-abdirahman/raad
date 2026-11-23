import { connectDatabases, disconnectDatabases, getRedis } from '../lib/databases.js';
import { logger } from '../lib/logger.js';

try {
  await connectDatabases();
  const reachable = getRedis() ? 'MongoDB and Redis are' : 'MongoDB is';
  logger.info(`Database check passed: ${reachable} reachable`);
  await disconnectDatabases();
} catch (error) {
  logger.fatal({ error }, 'Database check failed');
  process.exit(1);
}
