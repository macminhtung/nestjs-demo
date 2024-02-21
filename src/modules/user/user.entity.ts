import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from 'common/base.entity';
import { EntityEnum } from 'common/enums';
import { RoleEntity } from 'modules/role/role.entity';

@Entity({ name: EntityEnum.USER })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: new Date().getTime().toString() })
  sessionTimestamp: string;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({ name: EntityEnum.USER_ROLE })
  roles: RoleEntity[];
}
