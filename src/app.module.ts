import { Module, MiddlewareConsumer } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ConfigService } from 'modules/share/services/config.service';
import { SharedModule } from 'modules/share/shared.module';
import { HttpLoggerMiddleware } from 'middlewares/httpLogger.middleware';
// import { RabbitModule } from 'modules/rabbit-mq/rabbit.module';
import { BullMQModule } from 'modules/bull-mq/bull.module';

@Module({
  imports: [
    // RabbitModule,
    BullMQModule,
    SharedModule,
    UserModule,

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
