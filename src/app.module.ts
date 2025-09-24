import { Module } from '@nestjs/common';
import { UtilsModule } from './utils/utils.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisCacheOptions } from './config/redis.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { JwtConfig } from './config/jwt.config';
import { MailConfig } from './config/mail.config';
import { QueueConfig } from './config/queue.config';
import { StatusInterceptor } from './interceptors/status.interceptor';
import { AnalyticsService } from './services/analytics.service';
import { AnalyticsController } from './controllers/analytics.controller';
import { UserService } from './services/user.service';
import { PrismaService } from './config/prisma.service';
import { bullboardConfig } from './config/bull-board.config';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   // rootPath: join(__dirname, '..', 'uploads'),
    //   rootPath: './public',
    //   serveRoot: '/public',
    // }),
    QueueConfig,
    JwtConfig,
    MailConfig,
    bullboardConfig,
    // QueueModuleConfig,
    ConfigModule.forRoot(),
    HttpModule,
    UtilsModule,
    CacheModule.registerAsync(RedisCacheOptions)
  ],
  controllers: [
    AnalyticsController
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: StatusInterceptor,
    },
    UserService,
    AnalyticsService,
    PrismaService,
  ],
})
export class AppModule { }
