import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { PATTERN_NAMES, RABBIT_SERVICE_NAME } from 'common/constants/rabbitmq';

@Injectable()
export class RabbitService {
  constructor(
    @Inject(RABBIT_SERVICE_NAME)
    private readonly rabbitClient: ClientProxy,
  ) {}

  async handleMessage(message: string) {
    console.log('\n==> MESSAGE =', message);

    // Emit message
    this.rabbitClient.emit(PATTERN_NAMES.EMIT_PATTERN, {
      message: `EVENT-${message}`,
    });

    // Send message
    this.rabbitClient
      .send(PATTERN_NAMES.SEND_PATTERN, { message })
      .subscribe((response) => {
        console.log('\n ==> RESPONSE =', response);
      });

    return message;
  }
}
