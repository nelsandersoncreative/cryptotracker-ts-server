import dotenv from 'dotenv';
import express from 'express';
import { Express, NextFunction, Request, Response } from 'express-serve-static-core';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import get from 'lodash/get';

import { config } from './config';
import { authRouter, cryptoCompareRouter, userCoinsRouter } from './routes';
import { ENVIRONMENTS, MORGAN_OPTIONS, SERVER_MESSAGES } from './utils/constants';

dotenv.config();

type MorganOption = 'tiny' | 'common';

const { NODE_ENV } = config;

const server: Express = express();

const isProduction = NODE_ENV === ENVIRONMENTS.PRODUCTION;
const morganOption: MorganOption = isProduction ? MORGAN_OPTIONS.TINY : MORGAN_OPTIONS.COMMON;

server.use(express.static('public'));
server.use(morgan(morganOption));
server.use(helmet());
server.use(express.json());

server.use(cors());
server.set('view engine', 'ejs');

server.get("/", (_req: Request, res: Response) => {
  res.render('index', { message: SERVER_MESSAGES.SERVER_STARTED });
});

server.use('/api/auth', authRouter);
server.use('/api/user-coins', userCoinsRouter);
server.use('/api/cryptocompare', cryptoCompareRouter)
server.use(errorHandler);

function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  const code = get(error, 'status', 500);
  const message = code === 500 ? SERVER_MESSAGES.INTERNAL_SERVER_ERROR
    : get(error, 'message', SERVER_MESSAGES.INTERNAL_SERVER_ERROR);

  const response = { message, error };

  res
    .status(code)
    .json(response);
};

export { server };
