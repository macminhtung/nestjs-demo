import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateJobBodyDto {
  @ApiProperty()
  @IsString()
  message: string;
}
