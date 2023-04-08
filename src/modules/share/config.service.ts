import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { BullRootModuleOptions } from '@nestjs/bull';
import { ClientOptions, RmqOptions, Transport } from '@nestjs/microservices';
import {
  RABBIT_QUEUES,
  RABBIT_EXCHANGES,
  RABBIT_EXCHANGE_TYPES,
  RABBIT_CHANNELS,
} from 'common/constant/rabbitmq';
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';

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
  private static instanceCache?: ConfigService;

  public static get instance(): ConfigService {
    if (!this.instanceCache) {
      this.instanceCache = new this();
    }

    return this.instanceCache;
  }

  get config() {
    return APP_CONFIG;
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

  get rabbitConfig(): RmqOptions {
    const { username, password, port, host } = this.config.rabbit;
    const rabbitUrl =
      username && password
        ? `amqp://${username}:${password}@${host}:${port}`
        : `amqp://${host}:${port}`;
    const options: ClientOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitUrl],
        queue: RABBIT_QUEUES.MESSAGE_1,
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    };

    return options;
  }

  get rabbitAdvanceConfig(): RabbitMQConfig {
    const { username, password, port, host } = this.config.rabbit;
    const { CHANNEL_1, CHANNEL_2 } = RABBIT_CHANNELS;
    const rabbitUri =
      username && password
        ? `amqp://${username}:${password}@${host}:${port}`
        : `amqp://${host}:${port}`;
    const options: RabbitMQConfig = {
      uri: rabbitUri,
      enableControllerDiscovery: true,
      exchanges: [
        {
          name: RABBIT_EXCHANGES.DIRECT,
          type: RABBIT_EXCHANGE_TYPES.DIRECT,
        },
      ],
      // channels: {
      //   [CHANNEL_1]: {
      //     prefetchCount: 5,
      //     default: true,
      //   },
      //   [CHANNEL_2]: {
      //     prefetchCount: 2,
      //   },
      // },
    };

    return options;
  }
}
