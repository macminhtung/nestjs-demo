import { Module } from '@nestjs/common';
import { RabbitAdvanceController } from 'modules/rabbit-mq-advance/rabbit-advance.controller';
import { RabbitAdvanceService } from 'modules/rabbit-mq-advance/rabbit-advance.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from 'modules/share/config.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(
      RabbitMQModule,
      ConfigService.instance.rabbitAdvanceConfig,
    ),
  ],
  controllers: [RabbitAdvanceController],
  providers: [RabbitAdvanceService],
  exports: [RabbitAdvanceService],
})
export class RabbitAdvanceModule {}
