import { Module, MiddlewareConsumer } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ConfigService } from 'modules/shared/services/config.service';
import { SharedModule } from 'modules/shared/shared.module';
import { HttpLoggerMiddleware } from 'middlewares/httpLogger.middleware';
import { BullMQModule } from 'modules/bull-mq/bull.module';
import { GatewayModule } from 'gateways/gateway.module';
// import { RabbitModule } from 'modules/rabbit-mq/rabbit.module';

@Module({
  imports: [
    // BullMQModule,
    SharedModule,
    UserModule,
    GatewayModule,
    // RabbitModule,

    // #================================#
    // # ==> TYPE_ORM CONFIGURATION <== #
    // #================================#
    TypeOrmModule.forRootAsync({
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
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
