import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module';
import { TestController } from './test.controller';

@Module({
  imports: [RateLimiterModule],
  controllers: [AppController, TestController],
  providers: [AppService],
})
export class AppModule {}
