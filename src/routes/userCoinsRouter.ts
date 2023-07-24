import express from 'express';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { requireAuth } from '../middleware/jwtAuth';
import { UserCoinsService } from '../services';

const bodyParser = express.json();
const userCoinsRouter = express.Router();

/**
 * @route GET api/user-coins/:user_id
 * @desc Get a user's coin list (response is an array of coin_codes)
 * @access Private
 * @Headers Auth bearer token
 * pass in user id in params
 */
// the token system currently allows you to fetch any user's info with the token
userCoinsRouter
  .route('/:id')
  .get(requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    const { app, params: { id } } = req;
    const connection = app.get('db').getConnection();
    try {
      const coinsArray = await UserCoinsService.getUserCoins(connection, id as any);

      if (!coinsArray) {
        return next({status: 404, message: `Unable to find a list of coins with id: ${id}`});
      }
      console.log('COINS_ARRAY', coinsArray);
      connection.release()
      res.json(coinsArray);
   } catch(err) {
      next({status: 500, message: err.message});
    }

  });

/**
 * @route PUT api/user-coins/add-coins/
 * @desc Add/Remove a coin to user's coin list
 * @access Private
 * @Headers Auth bearer token
 * Pass in user_id and array of coins in req.body
 * replace the existing values in the DB with the new values
 */
userCoinsRouter
  .route('/add-coins/')
  .put(requireAuth, bodyParser, async (req: Request, res: Response, next: NextFunction) => {
    const { app, body: { coins, id } } = req;

    if (!id) return next({status: 400, message: 'user_id is required'});

    let response;
    try {
      const coinsArray = await UserCoinsService.getUserCoins(app.get('db'), id);
      const noCoins = coinsArray.length === 0;

      if (noCoins) {
        response = await UserCoinsService.createCoinsList(app.get('db'), coins, id);
      } else {
        response = await UserCoinsService.updateCoinsArray(app.get('db'), coins, id);
      }
      if (!response) {
        return next({ status: 500, message: 'No data found.' });
      }
    } catch (error) {
      return next({ status: 401, message: error });
    }

    return response;

  });

export { userCoinsRouter };
