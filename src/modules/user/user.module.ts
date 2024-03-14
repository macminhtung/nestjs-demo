import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleEntity } from 'modules/role/role.entity';
import { PROVIDER_TOKENS } from 'common/constants';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  controllers: [UserController],
  providers: [{ provide: PROVIDER_TOKENS.USER_SERVICE, useClass: UserService }],
  exports: [PROVIDER_TOKENS.USER_SERVICE],
})
export class UserModule {}
