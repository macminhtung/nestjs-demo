import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ArrayMinSize, IsString } from 'class-validator';

export class CreateRoleBodyDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ isArray: true, type: Number })
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  scopeIds: number[];
}
