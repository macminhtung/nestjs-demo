import { Injectable } from '@nestjs/common';
import { RABBIT_EXCHANGE_NAMES } from 'common/constant/rabbitmq';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class RabbitAdvanceService {
  constructor(private amqpConnection: AmqpConnection) {}

  async handleMessage(message: string) {
    console.log('\n==> MESSAGE_ADVANCE =', message);

    // Publish message
    const resData = await this.amqpConnection
      .publish(RABBIT_EXCHANGE_NAMES.FANOUT, '', {
        message,
      })
      .catch((err) => {
        console.log(err);
      });

    console.log('resData =', resData);

    return resData;
  }
}
