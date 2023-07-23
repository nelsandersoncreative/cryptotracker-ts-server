import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Knex } from 'knex';
import { config } from '../config';

const { JWT_SECRET, JWT_EXPIRY } = config;

export const AuthService = {
  findByEmail: (knex: Knex, user_email: string) => {
    return knex('users')
      .where({user_email})
      .first('*');
  },

  comparePasswords: async (loginPassword: string, savedPassword: string) => {
    return bcrypt.compare(loginPassword, savedPassword);
  },

  createJwt: (subject: any, payload: any) => {
    return jwt.sign(payload, JWT_SECRET, {
      subject,
      expiresIn: JWT_EXPIRY,
      algorithm: 'HS256'
    });
  },

  hashPassword: (password: string) => bcrypt.hash(password, 10),

  removeUser: (knex: Knex, user_id: string) => {
    return knex('users')
      .where({ 'id': user_id})
      .del();
  },

  verifyJwt: (token: string) => {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  },

  destroyJwt: (token: string) => {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  },
};
