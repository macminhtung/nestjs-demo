import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUE_NAMES, JOB_NAMES } from 'common/constants/bullmq';

@Injectable()
export class MessageProducer {
  constructor(@InjectQueue(QUEUE_NAMES.MESSAGE) private queue: Queue) {}

  async sendMessage(message: string) {
    await this.queue.add(JOB_NAMES.MESSAGE, {
      text: message,
    });
  }
}
