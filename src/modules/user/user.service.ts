import { Injectable } from '@nestjs/common';
import { UserEntity } from 'modules/user/user.entity';
import { BaseService } from 'common/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserInput,
  UpdateUserInput,
  DeleteUserInput,
  GetUserArgs,
  GetUsersArgs,
} from 'modules/user/dto';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  // #=====================#
  // # ==> CREATE USER <== #
  // #=====================#
  async createUser(input: CreateUserInput): Promise<UserEntity> {
    return await this.repository.save(input);
  }

  // #=====================#
  // # ==> UPDATE USER <== #
  // #=====================#
  async updateUser(input: UpdateUserInput): Promise<UserEntity> {
    await this.checkExist({ id: input.id });
    return await this.repository.save(input);
  }

  // #=====================#
  // # ==> DELETE USER <== #
  // #=====================#
  async deleteUser(input: DeleteUserInput): Promise<any> {
    return await this.repository.softDelete(input.id);
  }

  // #==================#
  // # ==> GET USER <== #
  // #==================#
  async getUser(args: GetUserArgs): Promise<UserEntity> {
    return await this.checkExist({
      where: { id: args.id },
      relations: { roles: true },
    });
  }

  // #===================#
  // # ==> GET USERS <== #
  // #===================#
  async getUsers(args: GetUsersArgs): Promise<UserEntity[]> {
    return await this.repository
      .createQueryBuilder('user')
      .where('id IN (:...ids)', { ids: args.ids })
      .getMany();
  }
}
