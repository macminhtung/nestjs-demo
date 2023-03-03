import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

const SHARING_SERVICES = [ConfigService];

@Global()
@Module({
  providers: SHARING_SERVICES,
  exports: SHARING_SERVICES,
})
export class SharedModule {}
