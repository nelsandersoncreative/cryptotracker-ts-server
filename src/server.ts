import knex from 'knex';

import { app } from './index';
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
  debug: isDevelopment
});

app.set('db', db);

createTables(db); // Check if tables exist, if they don't run migrations

app.listen(PORT, () => console.debug(`Server listening on port: ${PORT}`));
