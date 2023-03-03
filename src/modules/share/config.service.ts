import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import configuration, { IConfig } from 'configuration';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { BullRootModuleOptions } from '@nestjs/bull';

export class ConfigService {
  privateConfig: IConfig = configuration();

  get config(): IConfig {
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
}
