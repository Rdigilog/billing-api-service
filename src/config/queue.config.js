"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueConfig = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const config_1 = require("@nestjs/config");
exports.QueueConfig = bullmq_1.BullModule.forRootAsync({
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: async (configService) => ({
        connection: {
            url: `${configService.get('REDIS_URL')}`,
        },
        defaultJobOptions: {
            removeOnComplete: 1000,
            removeOnFail: 5000,
            attempts: 3,
        },
    }),
});
//# sourceMappingURL=queue.config.js.map