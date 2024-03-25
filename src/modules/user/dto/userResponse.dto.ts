import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'modules/user/user.entity';
import { RoleEntity } from 'modules/role/role.entity';

export class UserResponseDto extends UserEntity {
  @ApiProperty({
    type: () => RoleEntity,
    isArray: true,
  })
  roles: RoleEntity[];
}
