import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RateLimit } from './rate-limiter/rate-limiter.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @RateLimit(5, 60000)
  getHello(): string {
    return this.appService.getHello();
  }
}
