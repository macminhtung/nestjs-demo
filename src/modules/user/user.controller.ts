import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Inject } from '@nestjs/common';
import { UserService } from 'modules/user/user.service';
import {
  ApiResponsePagination,
  Authorization,
  UnAuthenticated,
} from 'decorators';
import {
  MODULE_NAMES,
  DEFAULT_SCOPES,
  PROVIDER_TOKENS,
} from 'common/constants';
import { PageOptionsDto } from 'common/dto';
import {
  UserResponseDto,
  CreateUserBodyDto,
  UpdateUserBodyDto,
} from 'modules/user/dto';

const { CREATE_USER, UPDATE_USER, DELETE_USER, GET_USER } = DEFAULT_SCOPES;

@ApiTags(MODULE_NAMES.USER.toUpperCase())
@Controller(MODULE_NAMES.USER)
export class UserController {
  constructor(
    @Inject(PROVIDER_TOKENS.USER_SERVICE)
    private readonly userService: UserService,
  ) {}

  // #==================#
  // # ==> GET USER <== #
  // #==================#
  @UnAuthenticated()
  @Get(':id')
  @ApiOkResponse({
    description: 'Get user successfully',
    type: UserResponseDto,
  })
  @Authorization([GET_USER.name])
  async getUser(@Param('id') userId: string) {
    return this.userService.getUser(userId);
  }

  // #===================#
  // # ==> GET USERS <== #
  // #===================#
  @Get()
  @ApiResponsePagination(UserResponseDto)
  @Authorization([GET_USER.name])
  async getUsers(@Query() query: PageOptionsDto) {
    return this.userService.getUsers(query);
  }

  // #=====================#
  // # ==> CREATE USER <== #
  // #=====================#
  @Post()
  @ApiOkResponse({
    description: 'Create user successfully',
    type: UserResponseDto,
  })
  @Authorization([CREATE_USER.name])
  async createUser(@Body() body: CreateUserBodyDto) {
    return this.userService.createUser(body);
  }

  // #=====================#
  // # ==> UPDATE USER <== #
  // #=====================#
  @Put(':id')
  @ApiOkResponse({
    description: 'Update user successfully',
    type: UserResponseDto,
  })
  @Authorization([UPDATE_USER.name])
  async updateUser(
    @Param('id') userId: string,
    @Body() body: UpdateUserBodyDto,
  ) {
    return this.userService.updateUser(userId, body);
  }

  // #=====================#
  // # ==> DELETE USER <== #
  // #=====================#
  @UnAuthenticated()
  @Delete(':id')
  @Authorization([DELETE_USER.name])
  async deleteUser(@Param('id') userId: string): Promise<string> {
    return this.userService.deleteUser(userId);
  }
}
