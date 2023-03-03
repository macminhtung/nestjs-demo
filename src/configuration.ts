import * as dotenv from 'dotenv';

if (['development', 'test'].includes(process.env.NODE_ENV)) {
  dotenv.config({
    path: '.env.development',
  });
}

export interface IDbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface IRedisConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface IConfig {
  nodeEnv: string;
  port: number;
  db: IDbConfig;
  redis: IRedisConfig;
}

export default function configuration(): IConfig {
  const configs = {
    nodeEnv: process.env.NODE_ENV,
    port: Number.parseInt(process.env.PORT, 10),
    db: {
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: Number.parseInt(process.env.REDIS_PORT, 10),
      username: process.env.REDIS_USERNAME || undefined,
      password: process.env.REDIS_PASSWORD || undefined,
    },
  };
  // console.log({ configs: JSON.stringify(configs) });

  return configs;
}
