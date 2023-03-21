import { Controller, Get, Query } from '@nestjs/common';
import { BullService } from 'modules/bull-mq/bull.service';

@Controller('bull-mq')
export class BullController {
  constructor(private readonly bullService: BullService) {}

  @Get('handle-msg')
  handleMessage(@Query('message') message: string) {
    return this.bullService.handleMessage(message);
  }
}
