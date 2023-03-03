import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MessageProducer } from 'modules/queues/message/message.producer';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly messageProducerService: MessageProducer,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('invoke-msg')
  getInvokeMsg(@Query('msg') msg: string) {
    this.messageProducerService.sendMessage(msg);
    return msg;
  }
}
