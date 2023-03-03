import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { GetUsersArgs } from './dto/args/get-users.args';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  async createUser(createUserData: CreateUserInput): Promise<UserEntity> {
    const newUser = this.repository.create(createUserData);
    return await this.repository.save(newUser);
  }

  async updateUser(updateUserData: UpdateUserInput): Promise<UserEntity> {
    return await this.repository.save(updateUserData);
  }

  async getUser(getUserArgs: GetUserArgs): Promise<UserEntity> {
    return await this.repository.findOneBy({ id: getUserArgs.id });
  }

  async getUsers(getUsersArgs: GetUsersArgs): Promise<UserEntity[]> {
    return await this.repository
      .createQueryBuilder('user')
      .where('id IN (:...ids)', { ids: getUsersArgs.ids })
      .getMany();
  }

  async deleteUser(deleteUserData: DeleteUserInput): Promise<any> {
    return await this.repository.softDelete(deleteUserData.id);
  }
}
