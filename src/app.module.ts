import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { DataSource } from 'typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ConfigService } from 'modules/share/config.service';
import { SharedModule } from 'modules/share/shared.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'interceptors/logging.interceptor';
import { RabbitModule } from 'modules/rabbit-mq/rabbit.module';
import { BullMQModule } from 'modules/bull-mq/bull.module';
import { RabbitAdvanceModule } from 'modules/rabbit-mq-advance/rabbit-advance.module';

@Module({
  imports: [
    RabbitModule,
    RabbitAdvanceModule,
    UserModule,
    BullMQModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
      inject: [ConfigService],
      dataSourceFactory: async (options) => {
        // console.log('\n ==> options =', options);
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        await dataSource.runMigrations();
        return dataSource;
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
