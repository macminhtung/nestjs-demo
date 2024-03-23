import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body } from '@nestjs/common';
import { BullService } from 'modules/bull-mq/bull.service';
import { UnAuthenticated } from 'decorators';
import { CreateJobBodyDto } from 'modules/bull-mq/dto';

@Controller('bull-mq')
@ApiTags('bull-mq'.toUpperCase())
export class BullController {
  constructor(private readonly bullService: BullService) {}

  @UnAuthenticated()
  @Post('handle-msg')
  handleMessage(@Body() body: CreateJobBodyDto) {
    return this.bullService.handleMessage(body);
  }
}
