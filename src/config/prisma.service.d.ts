import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/index';
import { ConfigService } from '@nestjs/config';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    private configService?;
    private readonly logger;
    private readonly execAsync;
    constructor(configService?: ConfigService | undefined);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    models(): Promise<string[]>;
    private runMigrations;
    healthCheck(): Promise<{
        status: string;
        message: string;
        details?: any;
    }>;
}
