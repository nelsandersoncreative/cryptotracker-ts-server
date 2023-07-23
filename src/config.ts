import dotenv from 'dotenv';

import { Config } from './types/Config';
import { ENVIRONMENTS as ENV } from './utils/constants';

dotenv.config();

// const setDatabaseUrl = (env: Environment) => {
//   const isProduction = env === ENV.PRODUCTION;
//   const isDevelopment = env === ENV.DEVELOPMENT;

//   return (isProduction && process.env.DATABASE_URL)
//     || (isDevelopment && process.env.DEV_DATABASE_URL)
//     || process.env.TEST_DATABASE_URL;
// };

export const config: Config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || ENV.DEVELOPMENT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT),
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY
};
