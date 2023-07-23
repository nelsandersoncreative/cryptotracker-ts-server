import { Knex } from 'knex';
import { Db } from '../types/Postgres';
import { DATABASE_MESSAGES, DB_SEED_USERS, DB_SEED_USER_COINS } from './constants';
import { AuthService } from '../services';

//check to see if tables exist.  create tables if they don't exist and seed the tables
export const createTables = (db: Db) => {
  db.schema
    .hasTable("users")
    .then(function (exists) {
      if (!exists) {
        db.schema
          .createTable("users", function (table) {
            table.increments("id").primary();
            table.string("user_name").notNullable();
            table.string("user_email").notNullable().unique();
            table.string("user_password").notNullable();
            table.timestamps(true, true);
          })
          .then(async () => {
            console.debug(DATABASE_MESSAGES.TABLE_CREATED);
            if (db.schema.hasTable('users')) {
              // hash user passwords before seeding
              async function hashUserPasswords() {
                const hashedUsers = await Promise.all(
                  DB_SEED_USERS.map(async (user) => {
                    try {
                      const hashedPassword = await AuthService.hashPassword(user.user_password, );
                      return { ...user, user_password: hashedPassword };
                    } catch (error) {
                      console.error(`Error hashing password for user ID ${user.user_email}:`, error);
                      return user; // Return the original user object in case of error
                    }
                  })
                );
                return hashedUsers;
              }

              const hashedUserData = await hashUserPasswords();

              // seed users table
              (db as Knex)('users')
                .insert(hashedUserData)
                .then(() => console.debug(DATABASE_MESSAGES.USERS_DATA_SEEDED))
                .catch((error) => console.debug(DATABASE_MESSAGES.USERS_DATA_SEEDING_FAILURE, error));
            }
          })
          .catch((err) => console.debug(DATABASE_MESSAGES.TABLE_NOT_CREATED, err));
      } else {
        console.debug(DATABASE_MESSAGES.TABLE_EXISTS);
      }
    })
    .then(() => {
      db.schema.hasTable("user_coins").then(function (exists) {
        if (!exists) {
          db.schema
            .createTable("user_coins", function (table) {
              table.increments("id").primary();
              table.specificType("coins", "text[]");
              table
                .integer("user_id")
                .references("id")
                .inTable("users")
                .onDelete("CASCADE")
                .notNullable();
              table.timestamps(true, true);
            })
            .then(() => {
              console.debug(DATABASE_MESSAGES.USER_COINS_TABLE_CREATED);

              // seed user_coins table
              (db as Knex)('user_coins')
                .insert(DB_SEED_USER_COINS)
                .then(() => console.debug(DATABASE_MESSAGES.USER_COINS_DATA_SEEDED))
                .catch((error) => console.debug(DATABASE_MESSAGES.USER_COINS_DATA_SEEDING_FAILURE, error));
            })
            .catch((error) =>
              console.debug(DATABASE_MESSAGES.USER_COINS_TABLE_FAILURE, error)
            );
        } else {
          console.debug(DATABASE_MESSAGES.USER_COINS_TABLE_EXISTS);
        }
      });
    });
};
