import { Body, Controller, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('send-notification')
  public async sendNotification(@Body() body: any): Promise<void> {
    await this.appService.sendNotification(body)
  }

  @Post('/config/save')
  public async saveConfig(@Body() body: any): Promise<void> {
    await this.appService.saveConfig(body);
  }
}
