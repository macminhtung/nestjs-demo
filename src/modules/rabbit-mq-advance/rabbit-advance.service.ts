import { Injectable } from '@nestjs/common';
import { RABBIT_EXCHANGES } from 'common/constant/rabbitmq';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class RabbitAdvanceService {
  constructor(private amqpConnection: AmqpConnection) {}

  async handleMessage(message: string) {
    console.log('\n==> MESSAGE_ADVANCE =', message);

    // Publish message
    await this.amqpConnection
      .publish(RABBIT_EXCHANGES.TOPIC, 'say-oh-yeah', {
        message,
      })
      .catch((err) => {
        console.log(err);
      });

    const response = await this.amqpConnection
      .request({
        exchange: RABBIT_EXCHANGES.TOPIC,
        routingKey: 'rpc',
        payload: {
          message,
        },
      })
      .catch((error) => console.log(`==> [ERROR]: ${error.message}`));

    console.log('response =', response);
    return response;
  }
}
