import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column({ nullable: true })
  age: number;

  @Field()
  @Column({ default: false })
  isSubcribed?: boolean;
}
