import { NextFunction, Request, Response } from 'express-serve-static-core';
import { AuthService } from '../services';
import { UserService } from '../services';

// check user authToken and user email to see if it's in database
export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const authToken = req.get('Authorization') || '';
  let token;

  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return next({ status: 401, message: 'Missing bearer token'});
  }

  token = authToken.slice('bearer '.length, authToken.length);

  try {
    const payload = AuthService.verifyJwt(token);
    const connection = await req.app.get('db').getConnection();
    const user = await UserService.findByEmail(connection, payload.sub as any);
    connection.release();
    if (!user) {
      return next({ status: 401, message: 'Unauthorized request'});
    }

    (req as any).user = user;
    next();
  } catch(err) {
    return next({status: 401, message: 'Unauthorized request'});
  }
};
