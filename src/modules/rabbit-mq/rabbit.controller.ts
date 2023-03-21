import { Controller, Get, Query } from '@nestjs/common';
import { RabbitService } from 'modules/rabbit-mq/rabbit.service';

@Controller('rabbit-mq')
export class RabbitController {
  constructor(private readonly rabbitService: RabbitService) {}

  @Get('handle-msg')
  handleMessage(@Query('message') message: string) {
    return this.rabbitService.handleMessage(message);
  }
}
