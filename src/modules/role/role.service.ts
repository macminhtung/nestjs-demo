import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'common/base.service';
import { RoleEntity } from 'modules/role/role.entity';
import { ScopeEntity } from 'modules/role/scope/scope.entity';
import { CreateRoleBodyDto } from 'modules/role/dto';
import { ScopeService } from 'modules/role/scope/scope.service';
import { PageOptionsDto, PageResponseDto } from 'common/dto';

@Injectable()
export class RoleService extends BaseService<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    public readonly roleRepository: Repository<RoleEntity>,

    private scopeService: ScopeService,
  ) {
    super(roleRepository);
  }

  checkListScopesIsValid(listScopes: ScopeEntity[]) {
    if (!listScopes.length)
      throw new NotFoundException({ message: 'No scope was found!' });
  }

  async checkRoleNameIsValid(name: string) {
    await this.checkExist({ name }, 'A role with this name already exists!');
  }

  // #=====================#
  // # ==> CREATE ROLE <== #
  // #=====================#
  async createRole(body: CreateRoleBodyDto): Promise<RoleEntity> {
    const { name, scopeIds } = body;

    // Check valid roleName
    await this.checkRoleNameIsValid(name);

    // Get listScopes by scopeIds
    const listScopes = await this.scopeService.repository.find({
      where: { id: In(scopeIds) },
    });

    // Check listScopes is valid
    this.checkListScopesIsValid(listScopes);

    // Create new role
    const newRole = await this.repository.save({
      name: name,
      scopes: listScopes,
    });
    return newRole;
  }

  // #=====================#
  // # ==> UPDATE ROLE <== #
  // #=====================#
  async updateRole(
    roleId: string,
    body: CreateRoleBodyDto,
  ): Promise<RoleEntity> {
    const { name, scopeIds } = body;

    // Check the role already exists
    const focusRole = await this.checkExist({ id: roleId });

    // Check valid roleName
    if (name !== focusRole.name) await this.checkRoleNameIsValid(name);

    // Check default role
    this.checkDefaultRecord(focusRole.isDefault);

    // Get listScopes by scopeIds
    const listScopes = await this.scopeService.repository.find({
      where: { id: In(scopeIds) },
    });

    // Check listScopes is valid
    this.checkListScopesIsValid(listScopes);

    // Update role
    const updatedRole = { ...focusRole, name: name, scopes: listScopes };
    await this.repository.save(updatedRole);

    return updatedRole;
  }

  // #=====================#
  // # ==> DELETE ROLE <== #
  // #=====================#
  async deleteRole(roleId: string): Promise<RoleEntity> {
    // Check the role already exists
    const focusRole = await this.checkExist({
      where: { id: roleId },
      relations: { scopes: true },
    });

    // Check default role
    this.checkDefaultRecord(focusRole.isDefault);

    // Delete role
    await this.repository.softDelete(focusRole.id);
    return focusRole;
  }

  // #======================#
  // # ==> RESTORE ROLE <== #
  // #======================#
  async restoreRole(roleId: string): Promise<RoleEntity> {
    // Check the role already exists
    const focusRole = await this.checkExist({
      where: { id: roleId },
      relations: { scopes: true },
      withDeleted: true,
    });

    // Restore role
    await this.repository.restore(focusRole.id);
    return focusRole;
  }

  // #================================#
  // # ==> GET ROLES [PAGINATION] <== #
  // #================================#
  async getRolesByQuery(
    query: PageOptionsDto,
  ): Promise<PageResponseDto<RoleEntity>> {
    const pagination = await this.getPaginationByQuery(query, () => {
      this.pagingQueryBuilder.leftJoinAndSelect(
        `${this.entityName}.scopes`,
        'SCs',
      );

      // Query records based on keySearch
      const { keySearch } = query;
      if (keySearch)
        this.pagingQueryBuilder.andWhere(
          `(${this.entityName}.name ILIKE :keySearch)`,
          {
            keySearch: `%${keySearch}%`,
          },
        );

      // Sorting based on id
      this.pagingQueryBuilder.addOrderBy(`${this.entityName}.id`, 'ASC');
    });

    return pagination;
  }
}
