import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'common/base.entity';
import { EntityEnum } from 'common/enums';

@Entity({ name: EntityEnum.SCOPE })
export class ScopeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ length: 2048, unique: true })
  description: string;
}
