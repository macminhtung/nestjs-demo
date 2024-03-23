import { Injectable } from '@nestjs/common';
import { MessageProducer } from 'modules/bull-mq/message/message.producer';
import { CreateJobBodyDto } from 'modules/bull-mq/dto';

@Injectable()
export class BullService {
  constructor(private readonly messageProducerService: MessageProducer) {}

  async handleMessage(body: CreateJobBodyDto) {
    await this.messageProducerService.sendMessage(body);
    return 'OK';
  }
}
