import { Controller, Get, Query } from '@nestjs/common';
import { RabbitAdvanceService } from 'modules/rabbit-mq-advance/rabbit-advance.service';

@Controller('rabbit-mq-advance')
export class RabbitAdvanceController {
  constructor(private readonly rabbitAdvanceService: RabbitAdvanceService) {}

  @Get('handle-msg')
  handleMessage(@Query('message') message: string) {
    return this.rabbitAdvanceService.handleMessage(message);
  }
}
