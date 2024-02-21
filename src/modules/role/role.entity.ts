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

@Entity({ name: EntityEnum.ROLE })
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToMany(() => UserEntity)
  @JoinTable({ name: EntityEnum.USER_ROLE })
  users: UserEntity[];

  @ManyToMany(() => ScopeEntity)
  @JoinTable({ name: EntityEnum.ROLE_SCOPE })
  scopes: ScopeEntity[];
}
