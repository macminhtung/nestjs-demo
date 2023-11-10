import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'modules/user/user.entity';
import { RoleEntity } from 'modules/role/role.entity';
import { RoleService } from 'modules/role/role.service';
import { RoleController } from 'modules/role/role.controller';
import { ScopeEntity } from 'modules/role/scope/scope.entity';
import { ScopeService } from 'modules/role/scope/scope.service';
import { ScopeController } from 'modules/role/scope/scope.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, ScopeEntity, UserEntity])],
  controllers: [RoleController, ScopeController],
  exports: [RoleService, ScopeService],
  providers: [RoleService, ScopeService],
})
export class RoleModule {}
