export type Environment = 'development' | 'production' | 'test';

export interface Config {
    PORT: string;
    NODE_ENV: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_NAME: string;
    DB_PASSWORD: string;
    JWT_SECRET: string;
    JWT_EXPIRY: string;
}
