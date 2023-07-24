import express from 'express';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { AuthService, UserService } from '../services';
import { requireAuth } from '../middleware/jwtAuth';
import { DatabaseUserEntry } from '../types/Users';
import { MESSAGES } from '../utils/constants';

const bodyParser = express.json();
const authRouter = express.Router();

/**
 * @route POST api/auth/register
 * @desc Register user
 * @access Public
 * @Headers key: Authorization value: Bearer <json web token>
 * in req.body as JSON pass in: user_name, user_email, user_password
 */
authRouter
  .route('/register')
  .post(bodyParser, async (req: Request, res: Response, next: NextFunction) => {
      const { user_name, user_email, user_password } = req.body;
      const user: DatabaseUserEntry = { user_name, user_email, user_password };

      for (const [key, value] of Object.entries(user)) {
        if (!value) {
          return next({ status: 400, message: `${key} is required`});
        } else if (value.startsWith(' ') || value.endsWith(' ')) {
          return next({ status: 400, message: `${key} cannot begin or end with spaces`});
        }
      }

      const response = UserService.validateUserFields(user);
      if (response.error) {
        return next({ status: 400, message: response });
      }

      try {
        // check if email is taken
        const emailTaken = await UserService.findByEmail(req.app.get('db'), user.user_email);

        if (emailTaken) {
          return next({ status: 400, message: 'Email is already in use' });
        }

        user.user_password = await AuthService.hashPassword(user.user_password);

        // insert the user into the DB
        const savedUser = await UserService.insert(req.app.get('db'), user);
        delete savedUser.user_password;

        // Return a JWT Token
        const sub = savedUser.user_email;
        const payload = { user_id: savedUser.user_id };
        const authToken = await AuthService.createJwt(sub, payload);
        savedUser.authToken = authToken;

        res
          .status(201)
          .location(`/api/users/${savedUser.id}`)
          .json(savedUser);
      } catch (err) {
        next({ message: err.message });
      }
  });

/**
 * @route  POST api/auth/login
 * @desc   Authorize user and get token
 * @access Public
 * @requires user_email
 * @requires user_password
 */
authRouter
  .route('/login')
  .post(bodyParser, async (req: Request, res: Response, next: NextFunction) => {
    const { user_email, user_password } = req.body;
    const cancelRequest = !user_email || !user_password;

    if (cancelRequest) {
      return next({ status: 400, message: MESSAGES.ENTER_CREDENTIALS });
    }

    const user = await UserService.findByEmail(req.app.get('db'), user_email);

    if (!user) {
      return next({ status: 401, message: MESSAGES.INVALID_CREDENTIALS });
    }

    const isMatch = await AuthService.comparePasswords(user_password, user.user_password);

    if (!isMatch) {
      return next({ status: 401, message: MESSAGES.INVALID_CREDENTIALS});
    }

    const sub = user.user_email;
    const payload = { user_id: user.id };

    const authToken = AuthService.createJwt(sub, payload);

    if (!authToken) {
      next({ status: 500, message: authToken });
    }

    res.json({ authToken, user: UserService.serialize(user) });
  });

/**
 * @route DELETE api/auth/:id
 * @desc Remove user
 * @access Private
 * @Headers key: Authorization value: Bearer <json web token>
 */
authRouter
  .route('/:id')
  .delete(requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next({status: 400, message: MESSAGES.ID_REQUIRED });
    }
    try {
      await AuthService.removeUser(req.app.get('db'), id);
      res.json({ message: MESSAGES.DELETE_SUCCESS });
    } catch(err) {
      next({status: 500, message: err.message});
    }
  });

export { authRouter };
