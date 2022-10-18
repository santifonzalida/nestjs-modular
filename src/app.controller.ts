import { Controller, Get, UseGuards, SetMetadata } from '@nestjs/common';

import { AppService } from './app.service';
import { ApiKeyGuard } from './auth/guards/api-key.guard';

@UseGuards(ApiKeyGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SetMetadata('isPublic', true)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/task/')
  getTasks() {
    return this.appService.getTasks();
  }
}
