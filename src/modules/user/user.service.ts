import { Injectable } from '@nestjs/common';
import { UserEntity } from 'modules/user/user.entity';
import { BaseService } from 'common/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'common/dto';
import { CreateUserBodyDto, UpdateUserBodyDto } from 'modules/user/dto';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  // #==================#
  // # ==> GET USER <== #
  // #==================#
  async getUser(userId: string): Promise<UserEntity> {
    return await this.checkExist({
      where: { id: userId },
      relations: { roles: true },
    });
  }

  // #=====================#
  // # ==> CREATE USER <== #
  // #=====================#
  async createUser(body: CreateUserBodyDto): Promise<UserEntity> {
    return await this.repository.save(body);
  }

  // #=====================#
  // # ==> UPDATE USER <== #
  // #=====================#
  async updateUser(
    userId: string,
    body: UpdateUserBodyDto,
  ): Promise<UserEntity> {
    await this.checkExist({ id: userId });
    return await this.repository.save(body);
  }

  // #=====================#
  // # ==> DELETE USER <== #
  // #=====================#
  async deleteUser(userId: string): Promise<string> {
    await this.repository.softDelete(userId);
    return userId;
  }

  // #===================#
  // # ==> GET USERS <== #
  // #===================#
  async getUsers(query: PageOptionsDto): Promise<UserEntity[]> {
    const queryBuilder = this.repository.createQueryBuilder('U');

    if (query.ids?.length)
      queryBuilder.where('U.id IN (:...ids)', { ids: query.ids });

    return await queryBuilder.leftJoinAndSelect('U.roles', 'Rs').getMany();
  }
}
