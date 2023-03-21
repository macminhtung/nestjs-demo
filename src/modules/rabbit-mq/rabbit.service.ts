import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RABBIT_SERVICE_NAMES } from 'common/constant/rabbitmq';

@Injectable()
export class RabbitService {
  constructor(
    @Inject(RABBIT_SERVICE_NAMES.RABBIT_MESSAGE_SERVICE)
    private readonly rabbitClient: ClientProxy,
  ) {}

  handleMessage(message: string) {
    this.rabbitClient.emit<any>('rabbit-message', { message });
    return true;
  }
}
