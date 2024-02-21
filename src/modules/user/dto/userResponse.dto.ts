import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'common/base.dto';
import { RoleResponseDto } from 'modules/role/dto';

export class UserResponseDto extends BaseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  sessionTimestamp: string;

  @ApiProperty({
    type: () => RoleResponseDto,
    isArray: true,
  })
  roles: RoleResponseDto[];
}
