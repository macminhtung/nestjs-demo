import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import {
  RABBIT_SERVICE_NAMES,
  RABBIT_MESSAGE_NAMES,
  RABBIT_EVENT_NAMES,
} from 'common/constant/rabbitmq';

@Injectable()
export class RabbitService {
  constructor(
    @Inject(RABBIT_SERVICE_NAMES)
    private readonly rabbitClient: ClientProxy,
  ) {}

  async handleMessage(message: string) {
    console.log('\n==> MESSAGE =', message);

    // Emit message
    this.rabbitClient.emit(RABBIT_EVENT_NAMES.TEST_EVENT_MESSAGE, {
      message: `EVENT-${message}`,
    });

    // Send message
    this.rabbitClient
      .send(RABBIT_MESSAGE_NAMES.TEST_MESSAGE, { message })
      .subscribe((response) => {
        console.log('\n ==> RESPONSE =', response);
      });

    return message;
  }
}
