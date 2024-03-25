import { Module } from '@nestjs/common';
import { UserModule } from 'modules/user/user.module';
import { SocketGateway } from 'gateways/socket.gateway';
import { PROVIDER_TOKENS } from 'common/constants';

@Module({
  imports: [UserModule],
  providers: [
    { provide: PROVIDER_TOKENS.SOCKET_GATEWAY, useClass: SocketGateway },
  ],
})
export class GatewayModule {}
