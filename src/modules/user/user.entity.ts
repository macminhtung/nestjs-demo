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
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: EntityEnum.USER })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  email: string;

  @Column({ nullable: true })
  @ApiProperty()
  displayName: string;

  @Column({ nullable: true })
  @ApiProperty()
  firstName: string;

  @Column({ nullable: true })
  @ApiProperty()
  lastName: string;

  @Column({ default: new Date().getTime().toString() })
  @ApiProperty()
  sessionTimestamp: string;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({ name: EntityEnum.USER_ROLE })
  roles: RoleEntity[];
}
