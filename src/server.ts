import knex from 'knex';

import { server } from './index';
import { config } from './config';
import { createTables } from './utils/createTables';
import { ENVIRONMENTS } from './utils/constants';

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_NAME,
  DB_PASSWORD,
  NODE_ENV,
  PORT,
} = config;

const isDevelopment = NODE_ENV === ENVIRONMENTS.DEVELOPMENT;

const db = knex({
  client: 'pg',
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    database: DB_NAME,
    password: DB_PASSWORD,
  },
  pool: {
    min: 2, // Minimum number of connections in the pool
    max: 10, // Maximum number of connections in the pool
  },
  debug: isDevelopment
});

server.set('db', db);

createTables(db); // Check if tables exist, if they don't run migrations

server.listen(PORT, () => console.debug(`Server listening on port: ${PORT}`));
