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

const app: Express = express();

// env variables for localhost and heroku
const isProduction = NODE_ENV === ENVIRONMENTS.PRODUCTION;
const morganOption: MorganOption = isProduction ? MORGAN_OPTIONS.TINY : MORGAN_OPTIONS.COMMON;

app.use(express.static('public'));
app.use(morgan(morganOption));
app.use(helmet());
app.use(express.json());

app.use(cors());
app.set('view engine', 'ejs');

app.get("/", (_req: Request, res: Response) => {
  // res.send(SERVER_MESSAGES.SERVER_STARTED);
  res.render('index', { message: SERVER_MESSAGES.SERVER_STARTED });
});

app.use('/api/auth', authRouter);
app.use('/api/user-coins', userCoinsRouter);
app.use('/api/cryptocompare', cryptoCompareRouter)
app.use(errorHandler);

function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  const code = get(error, 'status', 500);
  const message = code === 500 ? SERVER_MESSAGES.INTERNAL_SERVER_ERROR
    : get(error, 'message', SERVER_MESSAGES.INTERNAL_SERVER_ERROR);

  const response = { message, error };

  res
    .status(code)
    .json(response);
};

export { app };
