import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @CreateDateColumn({
    type: 'timestamp without time zone',
  })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
  })
  @ApiProperty()
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp without time zone',
    nullable: true,
  })
  @ApiProperty()
  deletedAt: Date;
}
