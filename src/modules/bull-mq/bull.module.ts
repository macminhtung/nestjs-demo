import { Module } from '@nestjs/common';
import { BullController } from 'modules/bull-mq/bull.controller';
import { BullModule } from '@nestjs/bull';
import { MessageProducer } from 'modules/bull-mq/message/message.producer';
import { MessageConsumer } from 'modules/bull-mq/message/message.consumer';
import { ConfigService } from 'modules/share/services/config.service';
import { QUEUE_NAMES } from 'common/constants/bullmq';
import { BullService } from 'modules/bull-mq/bull.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.bullConfig,
    }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.MESSAGE,
    }),
  ],
  controllers: [BullController],
  providers: [MessageProducer, MessageConsumer, BullService],
})
export class BullMQModule {}
