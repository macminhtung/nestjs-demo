import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { GetUserArgs } from './dto/args/get-user.args';
import { GetUsersArgs } from './dto/args/get-users.args';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { DeleteUserInput } from './dto/input/delete-user.input';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly _userService: UserService) {}

  @Query(() => UserEntity, { name: 'user', nullable: true })
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<UserEntity> {
    return this._userService.getUser(getUserArgs);
  }

  @Query(() => [UserEntity], { name: 'users', nullable: 'items' })
  async getUsers(@Args() getUsersArgs: GetUsersArgs): Promise<UserEntity[]> {
    return this._userService.getUsers(getUsersArgs);
  }

  @Mutation(() => UserEntity)
  async createUser(
    @Args('createUserData') createUserData: CreateUserInput,
  ): Promise<UserEntity> {
    return this._userService.createUser(createUserData);
  }

  @Mutation(() => UserEntity)
  async updateUser(
    @Args('updateUserData') updateUserData: UpdateUserInput,
  ): Promise<UserEntity> {
    return this._userService.updateUser(updateUserData);
  }

  @Mutation(() => UserEntity)
  async deleteUser(
    @Args('deleteUserData') deleteUserData: DeleteUserInput,
  ): Promise<UserEntity> {
    return this._userService.deleteUser(deleteUserData);
  }
}
