import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { DataSource } from 'typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { BullModule } from '@nestjs/bull';
import { MessageProducer } from 'modules/queues/message/message.producer';
import { MessageConsumer } from 'modules/queues/message/message.consumer';
import { ConfigService } from 'modules/share/config.service';
import { QUEUE_NAMES } from 'common/constant/bullmq';
import { SharedModule } from 'modules/share/shared.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'interceptors/logging.interceptor';

@Module({
  imports: [
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
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.bullConfig,
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.MESSAGE,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    AppService,
    MessageProducer,
    MessageConsumer,
  ],
})
export class AppModule {}
