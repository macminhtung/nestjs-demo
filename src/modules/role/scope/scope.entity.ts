import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'common/base.entity';
import { EntityEnum } from 'common/enums';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: EntityEnum.SCOPE })
export class ScopeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @ApiProperty()
  id: string;

  @Column({ unique: true })
  @ApiProperty()
  name: string;

  @Column({ length: 2048, unique: true })
  @ApiProperty()
  description: string;
}
