import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { BullRootModuleOptions } from '@nestjs/bull';
import { ClientOptions, RmqOptions, Transport } from '@nestjs/microservices';
import { RABBIT_QUEUE } from 'common/constants/rabbitmq';
import { MAIN_ENV } from 'env';

const { DATABASE, RABBIT, REDIS } = MAIN_ENV;

export class ConfigService {
  // # =============== #
  // # ==> TYPEORM <== #
  // # =============== #
  get typeOrmConfig(): TypeOrmModuleOptions {
    const migrations = [__dirname + '/../../../migrations/*{.ts,.js}'];
    const entities = [__dirname + '/../../../modules/**/*.entity{.ts,.js}'];

    const options: TypeOrmModuleOptions = {
      entities,
      migrations: migrations,
      keepConnectionAlive: true,
      type: 'postgres',
      host: DATABASE.HOST,
      port: DATABASE.PORT,
      username: DATABASE.USERNAME,
      password: DATABASE.PASSWORD,
      database: DATABASE.DATABASE,
      migrationsRun: false,
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
      logging: true,
    };

    return options;
  }

  // # =============== #
  // # ==> BULL MQ <== #
  // # =============== #
  get bullConfig(): BullRootModuleOptions {
    const options: BullRootModuleOptions = {
      redis: {
        host: REDIS.HOST,
        port: REDIS.PORT,
        username: REDIS.USERNAME,
        password: REDIS.PASSWORD,
      },
    };

    return options;
  }

  // # ================= #
  // # ==> RABBIT MQ <== #
  // # ================= #
  get rabbitConfig(): RmqOptions {
    const { USERNAME, PASSWORD, PORT, HOST } = RABBIT;
    const rabbitUrl =
      USERNAME && PASSWORD
        ? `amqp://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`
        : `amqp://${HOST}:${PORT}`;
    const options: ClientOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitUrl],
        queue: RABBIT_QUEUE,
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    };

    return options;
  }
}
