import { ApiProperty } from '@nestjs/swagger';
import { ScopeResponseDto } from 'modules/role/dto';
import { BaseDto } from 'common/base.dto';

export class RoleResponseDto extends BaseDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({
    type: () => ScopeResponseDto,
    isArray: true,
  })
  scopes: ScopeResponseDto[];
}
