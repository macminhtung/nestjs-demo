import { Injectable } from '@nestjs/common';
import { MessageProducer } from 'modules/bull-mq/message/message.producer';

@Injectable()
export class BullService {
  constructor(private readonly messageProducerService: MessageProducer) {}

  async handleMessage(message: string) {
    await this.messageProducerService.sendMessage(message);
    return message;
  }
}
