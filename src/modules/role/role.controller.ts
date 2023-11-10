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
import { RoleService } from 'modules/role/role.service';
import { MODULE_NAMES, DEFAULT_SCOPES } from 'common/constants';
import { CreateRoleBodyDto, RoleResponseDto } from 'modules/role/dto';
import { PageOptionsDto } from 'common/dto';
import { ApiResponsePagination, Authorization } from 'decorators';

const { CREATE_ROLE, UPDATE_ROLE, DELETE_ROLE, GET_ROLE } = DEFAULT_SCOPES;

@ApiTags(MODULE_NAMES.ROLE.toUpperCase())
@Controller(MODULE_NAMES.ROLE)
export class RoleController {
  constructor(private roleService: RoleService) {}

  // #=====================#
  // # ==> CREATE ROLE <== #
  // #=====================#
  @Authorization([CREATE_ROLE.name])
  @Post()
  @ApiOkResponse({
    description: 'Create role successfully',
    type: RoleResponseDto,
  })
  createRole(@Body() body: CreateRoleBodyDto) {
    return this.roleService.createRole(body);
  }

  // #=====================#
  // # ==> UPDATE ROLE <== #
  // #=====================#
  @Authorization([UPDATE_ROLE.name])
  @Put(':id')
  @ApiOkResponse({
    description: 'Update role successfully',
    type: RoleResponseDto,
  })
  updateRole(@Param('id') roleId: string, @Body() body: CreateRoleBodyDto) {
    return this.roleService.updateRole(roleId, body);
  }

  // #=====================#
  // # ==> DELETE ROLE <== #
  // #=====================#
  @Authorization([DELETE_ROLE.name])
  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete role successfully',
    type: RoleResponseDto,
  })
  deleteRole(@Param('id') roleId: string) {
    return this.roleService.deleteRole(roleId);
  }

  // #======================#
  // # ==> RESTORE ROLE <== #
  // #======================#
  @Authorization([CREATE_ROLE.name])
  @Post(':id/restore')
  @ApiOkResponse({
    description: 'Restore role successfully',
    type: RoleResponseDto,
  })
  restoreRole(@Param('id') roleId: string) {
    return this.roleService.restoreRole(roleId);
  }

  // #================================#
  // # ==> GET ROLES [PAGINATION] <== #
  // #================================#
  @Authorization([GET_ROLE.name])
  @Get()
  @ApiResponsePagination(RoleResponseDto)
  getRolesByQuery(@Query() query: PageOptionsDto) {
    return this.roleService.getRolesByQuery(query);
  }
}
