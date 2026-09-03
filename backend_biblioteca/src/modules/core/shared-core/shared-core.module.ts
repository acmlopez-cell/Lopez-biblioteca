import { Global, Module } from '@nestjs/common';
import { controllers } from '@modules/core/shared-core/controllers';
import { coreProviders } from '@modules/core/core.provider';
import { CacheModule } from '@nestjs/cache-manager';
import { CareersService } from '@modules/core/shared-core/services/careers.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers,
  providers: [...coreProviders, CareersService],
  exports: [],
})
export class SharedCoreModule {}
