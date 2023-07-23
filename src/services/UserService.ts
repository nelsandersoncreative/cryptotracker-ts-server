import { Knex } from 'knex';
import { DatabaseUserEntry, User, UserValidationField, ValidationMethods } from '../types/Users';
import { VALIDATION } from '../utils/constants';

export const UserService = {
  validateUserFields(user: User) {
    const entities: UserValidationField[] = ['user_name', 'user_email', 'user_password'];
    const validations: ValidationMethods = {
      user_name: this.validateUserName,
      user_email: this.validateUserEmail,
      user_password: this.validateUserPassword
    };

    return entities.reduce((response: User, field: UserValidationField) => {
      let result = validations[field](user[field]);
      if (result.error) {
        response[field] = result.error as string;
        response.error = true;
      }
      return response;
    }, {});
  },

  validateUserName: (user_name: string) => {
    const response: User = {};
    if (user_name.length < 3) {
      response.error = VALIDATION.MINIMUM_CHARACTERS;
    }
    return response;
  },

  validateUserEmail: (user_email: string) => {
    const response: User = {};
    if (!/\S+@\S+/.test(user_email)) {
      response.error = VALIDATION.INVALID_EMAIL;
    }
    return response;
  },

  validateUserPassword: (user_password: string) => {
    const response: User = {};
    if (user_password.length < 6) {
      response.error = VALIDATION.INVALID_PASSWORD;
    }
    return response;
  },

  insert: async (knex: Knex, user: DatabaseUserEntry) => {
    return knex('users')
      .insert(user)
      .returning('*')
      .then(rows => rows[0]);
  },

  findById(knex: Knex, id: number) {
    return knex('users')
      .where({id})
      .first('*');
  },

  findByEmail(knex: Knex, user_email: string) {
    return knex('users')
      .where({user_email})
      .first('*');
  },

  serialize(user: User) {
    const { id, user_name, user_email } = user;
    return { id, user_name, user_email };
  }
};
