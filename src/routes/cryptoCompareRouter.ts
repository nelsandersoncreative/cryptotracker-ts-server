import express from 'express';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { requireAuth } from '../middleware/jwtAuth';
import { CryptoCompareService } from '../services/CryptoCompareService';

const bodyParser = express.json();
const cryptoCompareRouter = express.Router();

/**
 * @route GET api/cryptocompare/coin-list
 * @desc Get a user's coin list (response is an array of coin_codes)
 * @access Private
 * @Headers Auth bearer token
 */
// Get the current list of all cryptocurrencies
cryptoCompareRouter
  .route('/coin-list')
  .get(requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    const { params: { id } } = req;
    const { data } = await CryptoCompareService.getCoinList();
    const formattedData = Object.values(data.Data);

    if (data) {
      return res.json(formattedData);
    } else {
      return next({status: 404, message: `Unable to find a list of coins with id: ${id}`});
    }
  });

/**
 * @route GET api/cryptocompare/coins
 * @desc Get a user's coin list (response is an array of coin_codes)
 * @access Private
 * @Headers Auth bearer token
 */
// Get information about a list of specific coins
cryptoCompareRouter
  .route('/coins')
  .post(requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    const { body: { coins } } = req;
    const { data } = await CryptoCompareService.getCoins(coins);

    if (data) {
      return res.json(data);
    } else {
      return next({status: 404, message: `Unable to find data for the following: ${coins}`});
    }
  });

export { cryptoCompareRouter };
