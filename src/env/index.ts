import * as dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env',
});

const {
  PORT,
  SOCKET_PORT,
  JWT_SECRET_KEY,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USERNAME,
  REDIS_PASSWORD,
  RABBIT_HOST,
  RABBIT_PORT,
  RABBIT_USERNAME,
  RABBIT_PASSWORD,
} = process.env;

export const MAIN_ENV = {
  APP: {
    PORT: Number.parseInt(PORT, 10) || 4000,
    SOCKET_PORT: Number.parseInt(SOCKET_PORT, 10) || 4001,
    JWT_SECRET_KEY: JWT_SECRET_KEY,
  },
  DATABASE: {
    HOST: DB_HOST,
    PORT: Number.parseInt(DB_PORT, 10) || 5432,
    USERNAME: DB_USERNAME,
    PASSWORD: DB_PASSWORD,
    DATABASE: DB_NAME,
  },
  REDIS: {
    HOST: REDIS_HOST,
    PORT: Number.parseInt(REDIS_PORT, 10) || 6379,
    USERNAME: REDIS_USERNAME || undefined,
    PASSWORD: REDIS_PASSWORD || undefined,
  },
  RABBIT: {
    HOST: RABBIT_HOST,
    PORT: Number.parseInt(RABBIT_PORT, 10) || 5672,
    USERNAME: RABBIT_USERNAME || undefined,
    PASSWORD: RABBIT_PASSWORD || undefined,
  },
};
