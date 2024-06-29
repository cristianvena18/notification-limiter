import { Module, Scope } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import Redlock from 'redlock';
import Client from 'ioredis';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'RedLock',
      scope: Scope.DEFAULT,
      useFactory: () => {
        const client1 = new Client(process.env.REDLOCK_CLIENT_ONE);
        const client2 = new Client(process.env.REDLOCK_CLIENT_TWO);
        const client3 = new Client(process.env.REDLOCK_CLIENT_THREE);

        return new Redlock([
          client1,
          client2,
          client3
        ]);
      }
    }]
})
export class AppModule {
}
