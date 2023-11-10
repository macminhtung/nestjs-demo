import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScopeService } from 'modules/role/scope/scope.service';
import { MODULE_NAMES, DEFAULT_SCOPES } from 'common/constants';
import { ScopeResponseDto } from 'modules/role/dto';
import { PageOptionsDto } from 'common/dto';
import { ApiResponsePagination, Authorization } from 'decorators';

const { GET_ROLE } = DEFAULT_SCOPES;

@ApiTags(MODULE_NAMES.SCOPE.toUpperCase())
@Controller(MODULE_NAMES.SCOPE)
export class ScopeController {
  constructor(private scopeService: ScopeService) {}
  // #================================#
  // # ==> GET SCOPES [PAGINATION] <== #
  // #================================#
  @Authorization([GET_ROLE.name])
  @Get()
  @ApiResponsePagination(ScopeResponseDto)
  getScopesByQuery(@Query() query: PageOptionsDto) {
    return this.scopeService.getScopesByQuery(query);
  }
}
