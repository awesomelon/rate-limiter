import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { RateLimitInterceptor } from './rate-limit/rate-limit.interceptor';

@Controller()
@UseInterceptors(RateLimitInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
