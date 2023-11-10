import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'common/base.dto';

export class ScopeResponseDto extends BaseDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
