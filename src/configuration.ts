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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRabbitConfig extends IRedisConfig {}

export interface IConfig {
  nodeEnv: string;
  port: number;
  db: IDbConfig;
  redis: IRedisConfig;
  rabbit: IRabbitConfig;
}

export default function configuration(): IConfig {
  const configs = {
    nodeEnv: process.env.NODE_ENV,
    port: Number.parseInt(process.env.PORT, 10) || 5000,
    db: {
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: Number.parseInt(process.env.REDIS_PORT, 10) || 6379,
      username: process.env.REDIS_USERNAME || undefined,
      password: process.env.REDIS_PASSWORD || undefined,
    },
    rabbit: {
      host: process.env.RABBIT_HOST,
      port: Number.parseInt(process.env.RABBIT_PORT, 10) || 5672,
      username: process.env.RABBIT_USERNAME || undefined,
      password: process.env.RABBIT_PASSWORD || undefined,
    },
  };
  // console.log({ configs: JSON.stringify(configs) });

  return configs;
}
