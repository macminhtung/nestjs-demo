import { Module } from '@nestjs/common';
import { RabbitController } from 'modules/rabbit-mq/rabbit.controller';
import { SharedModule } from 'modules/shared/shared.module';
import { ConfigService } from 'modules/shared/services/config.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { RABBIT_SERVICE_NAME } from 'common/constants/rabbitmq';
import { RabbitService } from 'modules/rabbit-mq/rabbit.service';

@Module({
  imports: [SharedModule],
  controllers: [RabbitController],
  providers: [
    {
      provide: RABBIT_SERVICE_NAME,
      useFactory: (configService: ConfigService) => {
        const options = configService.rabbitConfig;
        const clientProxy = ClientProxyFactory.create(options);
        return clientProxy;
      },
      inject: [ConfigService],
    },
    RabbitService,
  ],
})
export class RabbitModule {}
