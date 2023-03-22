import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { BullRootModuleOptions } from '@nestjs/bull';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { RABBIT_QUEUE_NAMES } from 'common/constant/rabbitmq';

import * as dotenv from 'dotenv';

if (['development', 'test'].includes(process.env.NODE_ENV)) {
  dotenv.config({
    path: '.env.development',
  });
}

interface IDbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

interface IRedisConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IRabbitConfig extends IRedisConfig {}

interface IConfig {
  nodeEnv: string;
  port: number;
  db: IDbConfig;
  redis: IRedisConfig;
  rabbit: IRabbitConfig;
}

export const APP_CONFIG: IConfig = {
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

export class ConfigService {
  privateConfig = APP_CONFIG;

  get config() {
    return this.privateConfig;
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    const migrations = [__dirname + '/../migrations/*{.ts,.js}'];
    const entities = [__dirname + '/../modules/**/*.entity{.ts,.js}'];
    // console.log('\n ==> migrations =', migrations);

    const options: TypeOrmModuleOptions = {
      entities,
      migrations: migrations,
      keepConnectionAlive: true,
      type: 'postgres',
      host: this.config.db.host,
      port: this.config.db.port,
      username: this.config.db.username,
      password: this.config.db.password,
      database: this.config.db.database,
      migrationsRun: false,
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
      logging: true,
    };

    return options;
  }

  get bullConfig(): BullRootModuleOptions {
    const options: BullRootModuleOptions = {
      redis: {
        host: this.config.redis.host,
        port: this.config.redis.port,
        username: this.config.redis.username,
        password: this.config.redis.password,
      },
    };

    return options;
  }

  get rabbitConfig(): ClientOptions {
    const { username, password, port, host } = this.config.rabbit;
    const rabbitUrl =
      username && password
        ? `amqp://${username}:${password}@${host}:${port}`
        : `amqp://${host}:${port}`;
    const options: ClientOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitUrl],
        queue: RABBIT_QUEUE_NAMES.RABBIT_MESSAGE,
        queueOptions: {
          durable: true,
        },
      },
    };

    return options;
  }
}
