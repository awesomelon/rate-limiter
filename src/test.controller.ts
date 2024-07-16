import { Controller, Get } from '@nestjs/common';
import { RateLimit } from './decorators';

@Controller('test')
export class TestController {
  @Get()
  @RateLimit(5, 10000, (req) => req.headers['user-agent'])
  getHello(): string {
    return 'Hello World';
  }
}
