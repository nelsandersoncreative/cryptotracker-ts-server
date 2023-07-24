import { Knex } from 'knex';

export interface Row {
  id: number;
  coins: string[];
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export const UserCoinsService = {
  getUserCoins: async (knex: Knex, user_id: number) => {
    try {
      return knex('user_coins')
        .select('coins')
        .where({ user_id })
        .then((coins: { coins: string[] }[]) => coins);
    } catch (error) {
      console.error(error);
    }
  },
  createCoinsList: async (knex: Knex, coins: string[], user_id: number) => {
    return knex('user_coins')
      .insert({ user_id, coins })
      .returning("*")
      .then((rows: Row[]) => rows[0]);
  },
  updateCoinsArray: async (knex: Knex, coins: string[], user_id: number) => {
    return knex('user_coins')
      .where({ user_id })
      .update({ coins })
      .returning("*")
      .then((rows: Row[]) => {
        return rows[0]
      });
  }
};
