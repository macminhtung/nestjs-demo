import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'common/base.service';
import { ScopeEntity } from 'modules/role/scope/scope.entity';
import { PageOptionsDto, PageResponseDto } from 'common/dto';

@Injectable()
export class ScopeService extends BaseService<ScopeEntity> {
  constructor(
    @InjectRepository(ScopeEntity)
    public readonly scopeRepository: Repository<ScopeEntity>,
  ) {
    super(scopeRepository);
  }

  // #=================================#
  // # ==> GET SCOPES [PAGINATION] <== #
  // #=================================#
  async getScopesByQuery(
    query: PageOptionsDto,
  ): Promise<PageResponseDto<ScopeEntity>> {
    const pagination = await this.getPaginationByQuery(query);
    return pagination;
  }
}
