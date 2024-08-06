import { Controller, Get } from '@nestjs/common';
import { RateLimit } from './decorators';

@Controller()
export class TestController {
  @Get('test')
  @RateLimit(5, 60000)
  getHello(): string {
    return 'Hello World';
  }

  @Get('custom')
  @RateLimit(5, 60000, (req) => req.headers['user-agent']) // 5 requests per minute, custom key (User-Agent)
  getCustomTest() {
    return 'This is a custom rate-limited endpoint';
  }
}
