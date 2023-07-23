export const SERVER_MESSAGES = {
  SERVER_STARTED: 'CryptoTracker Service',
  INTERNAL_SERVER_ERROR: 'Internal server error',
} as const;

export const DATABASE_MESSAGES = {
  TABLE_CREATED: 'Users table created.',
  TABLE_EXISTS: 'Users table exists.',
  TABLE_NOT_CREATED: 'Unable to create users table.',
  USER_COINS_TABLE_CREATED: 'User coins table created.',
  USER_COINS_TABLE_EXISTS: 'User coins table exists.',
  USER_COINS_TABLE_FAILURE: 'Unable to create user coins table.',
  USERS_DATA_SEEDED: 'Users data seeded successfully.',
  USERS_DATA_SEEDING_FAILURE: 'User data seeding failed.',
  USER_COINS_DATA_SEEDED: 'User coins data seeded successfully.',
  USER_COINS_DATA_SEEDING_FAILURE: 'User coins data seeding failed.'
} as const;

export const MESSAGES = {
  ENTER_CREDENTIALS: 'Enter a username, email and password.',
  INVALID_CREDENTIALS: 'Try again. Wrong username, email or password.',
  ID_REQUIRED: 'User id is required',
  DELETE_SUCCESS: 'User profile deleted successfully',
} as const;

export const VALIDATION = {
  MINIMUM_CHARACTERS: 'Username must be at least 3 characters',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
} as const;

export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
} as const;

export const MORGAN_OPTIONS = {
  TINY: 'tiny',
  COMMON: 'common',
} as const;

export interface DatabaseRowUsers {
  user_name: string;
  user_email: string;
  user_password: string;
}

export interface DatabaseRowUserCoins {
  coins: string[]; // ['BTC', 'ABC]
  user_id: number; // 1
}

export const DB_SEED_USERS: DatabaseRowUsers[] = [
  { user_name: 'John', user_email: 'john@example.com', user_password: 'password123' },
  { user_name: 'Jane', user_email: 'jane@example.com', user_password: 'password456' },
  { user_name: 'Alice', user_email: 'alice@example.com', user_password: 'password789' },
  { user_name: 'Sample', user_email: 'sampleuser@sampleuser.com', user_password: 'foobar' },
];

export const DB_SEED_USER_COINS: DatabaseRowUserCoins[] = [
  { coins: ['AXR', 'BTC'], user_id: 1 },
  { coins: ['AURORAC', 'BTC'], user_id: 2 },
  { coins: ['ALIEN', 'BTC'], user_id: 3 },
  { coins: ['AEGIS', 'BTC'], user_id: 4 },
];
