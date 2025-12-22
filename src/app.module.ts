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
import { UserService } from './services/user.service';
import { PrismaService } from './config/prisma.service';
import { bullboardConfig } from './config/bull-board.config';
import { SubscriptionService } from './services/subscription.service';
import { SubscriptionController } from './controllers/subscription.controller';
import { HealthController } from './controllers/health.controller';
import { PaystackService } from './services/thirdparty/paystack.service';
import { CardinformationService } from './services/cardinformation.service';
import { CardinformationController } from './controllers/cardinformation.controller';

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
    ConfigModule.forRoot({
      isGlobal: true, // 👈 THIS
    }),
    HttpModule,
    UtilsModule,
    CacheModule.registerAsync(RedisCacheOptions),
  ],
  controllers: [
    SubscriptionController,
    HealthController,
    CardinformationController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: StatusInterceptor,
    },
    UserService,
    PrismaService,
    SubscriptionService,
    PaystackService,
    CardinformationService,
  ],
})
export class AppModule {}
