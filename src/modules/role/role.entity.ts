import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from 'common/base.entity';
import { ScopeEntity } from 'modules/role/scope/scope.entity';
import { EntityEnum } from 'common/enums';
import { UserEntity } from 'modules/user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: EntityEnum.ROLE })
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @ApiProperty()
  id: string;

  @Column({ unique: true })
  @ApiProperty()
  name: string;

  @Column({ default: false })
  @ApiProperty()
  isDefault: boolean;

  @ManyToMany(() => UserEntity)
  @JoinTable({ name: EntityEnum.USER_ROLE })
  users: UserEntity[];

  @ManyToMany(() => ScopeEntity)
  @JoinTable({ name: EntityEnum.ROLE_SCOPE })
  scopes: ScopeEntity[];
}
