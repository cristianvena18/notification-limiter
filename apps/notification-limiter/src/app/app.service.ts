import { HttpException, Inject, Injectable } from '@nestjs/common';
import Redlock from 'redlock';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class AppService {

  constructor(
    @Inject('RedLock') private redLock: Redlock,
    @Inject(CACHE_MANAGER) private client: Cache
  ) {
  }

  async sendNotification(body: any) {

    const { userId, notificationType: type } = body;

    const locking = await this.acquireLocking(userId);

    const configuration = await this.client.get('config');

    try {
      let timesByType = await this.client.get<number>(`notifications:${userId}:${type}`);

      if (!timesByType) {
        timesByType = 1;
      } else {
        timesByType++;
      }

      // { "news": { "value": 1, "period": 86400 } }
      if (timesByType > configuration[type].value) {
        throw new HttpException(`User ${userId} has reached the limit of ${type} notifications.`, 429);
      }

      // should use cache function not override ttl here
      await this.client.set(`notifications:${userId}:${type}`, timesByType, configuration[type].period);

      // send notification

    } finally {
      await locking.release();
    }
  }

  private async acquireLocking(userId: any) {
    return await this.redLock.acquire([userId], Number(process.env.ACQUIRE_LOCKING_TIMEOUT));
  }

  async saveConfig(body: any) {
    await this.client.set('config', body, 0);
  }
}
