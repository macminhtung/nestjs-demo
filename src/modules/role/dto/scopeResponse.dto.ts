import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'common/base.dto';

export class ScopeResponseDto extends BaseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
