import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from 'modules/role/role.entity';
import { ScopeEntity } from 'modules/role/scope/scope.entity';

export class RoleResponseDto extends RoleEntity {
  @ApiProperty({
    type: () => ScopeEntity,
    isArray: true,
  })
  scopes: ScopeEntity[];
}
