import { Inject } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserEntity } from 'modules/user/user.entity';
import { UserService } from 'modules/user/user.service';
import {
  CreateUserInput,
  UpdateUserInput,
  DeleteUserInput,
  GetUserArgs,
  GetUsersArgs,
} from 'modules/user/dto';
import { Authorization, UnAuthenticated } from 'decorators';
import { DEFAULT_SCOPES, PROVIDER_TOKENS } from 'common/constants';

const { CREATE_USER, UPDATE_USER, DELETE_USER, GET_USER } = DEFAULT_SCOPES;

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(
    @Inject(PROVIDER_TOKENS.USER_SERVICE)
    private readonly userService: UserService,
  ) {}

  // #==================#
  // # ==> GET USER <== #
  // #==================#
  @UnAuthenticated()
  @Query(() => UserEntity)
  @Authorization([GET_USER.name])
  async getUser(@Args() args: GetUserArgs): Promise<UserEntity> {
    return this.userService.getUser(args);
  }

  // #===================#
  // # ==> GET USERS <== #
  // #===================#
  @UnAuthenticated()
  @Query(() => [UserEntity])
  @Authorization([GET_USER.name])
  async getUsers(@Args() args: GetUsersArgs): Promise<UserEntity[]> {
    return this.userService.getUsers(args);
  }

  // #=====================#
  // # ==> CREATE USER <== #
  // #=====================#
  @UnAuthenticated()
  @Mutation(() => UserEntity)
  @Authorization([CREATE_USER.name])
  async createUser(@Args('input') input: CreateUserInput): Promise<UserEntity> {
    return this.userService.createUser(input);
  }

  // #=====================#
  // # ==> UPDATE USER <== #
  // #=====================#
  @UnAuthenticated()
  @Mutation(() => UserEntity)
  @Authorization([UPDATE_USER.name])
  async updateUser(@Args('input') input: UpdateUserInput): Promise<UserEntity> {
    return this.userService.updateUser(input);
  }

  // #=====================#
  // # ==> DELETE USER <== #
  // #=====================#
  @UnAuthenticated()
  @Mutation(() => UserEntity)
  @Authorization([DELETE_USER.name])
  async deleteUser(@Args('input') input: DeleteUserInput): Promise<UserEntity> {
    return this.userService.deleteUser(input);
  }
}
