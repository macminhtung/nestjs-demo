import { Repository, FindOptionsWhere, DataSource, QueryRunner } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import {
  HttpStatus,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export abstract class BaseService<E extends AbstractEntity> {
  constructor(public readonly repository: Repository<E>) {}

  @InjectDataSource()
  public readonly dataSource: DataSource;

  async startTransaction(): Promise<QueryRunner> {
    try {
      // Open a new transaction
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.startTransaction();
      return queryRunner;
    } catch (err: any) {
      // console.log('\n ==> ERR =', err.message);
      throw new BadRequestException(err);
    }
  }

  async handleTransactionAndRelease(
    queryRunner: QueryRunner,
    callback: () => Promise<void>,
  ): Promise<void> {
    try {
      // Run callback function
      await callback();

      // Commit transaction
      await queryRunner.commitTransaction();

      // Rollback
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);

      // Release the query runner
    } finally {
      await queryRunner.release();
    }
  }

  async checkExist(condition: FindOptionsWhere<E>): Promise<E> {
    const existRecord = await this.repository.findOneBy(condition);
    if (!existRecord)
      throw new NotFoundException({
        message: `${''} Not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    return existRecord;
  }
}
