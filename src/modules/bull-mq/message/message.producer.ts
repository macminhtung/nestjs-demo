import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUE_NAMES, JOB_NAMES } from 'common/constants/bullmq';
import { CreateJobBodyDto } from 'modules/bull-mq/dto';

@Injectable()
export class MessageProducer {
  constructor(@InjectQueue(QUEUE_NAMES.MESSAGE) private queue: Queue) {}

  async sendMessage(body: CreateJobBodyDto) {
    await this.queue.add(JOB_NAMES.MESSAGE, body, { priority: 1 });
  }
}
