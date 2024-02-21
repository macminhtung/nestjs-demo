import { ApiProperty } from '@nestjs/swagger';
import { ScopeResponseDto } from 'modules/role/dto';
import { BaseDto } from 'common/base.dto';

export class RoleResponseDto extends BaseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({
    type: () => ScopeResponseDto,
    isArray: true,
  })
  scopes: ScopeResponseDto[];
}
