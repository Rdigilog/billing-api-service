import { RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';
export declare const RedisProvider: {
    provide: string;
    useFactory: (configService: ConfigService) => Promise<RedisClientType>;
    inject: (typeof ConfigService)[];
};
