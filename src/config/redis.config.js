"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheOptions = void 0;
const config_1 = require("@nestjs/config");
const cache_manager_redis_store_1 = require("cache-manager-redis-store");
exports.RedisCacheOptions = {
    isGlobal: true,
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: async (configService) => {
        console.log('Setting up Redis Cache with URL:', configService.get('REDIS_URL'));
        const store = await (0, cache_manager_redis_store_1.redisStore)({
            url: `${configService.get('REDIS_URL')}`,
        });
        return {
            store: () => store,
            ttl: 60 * 5,
        };
    },
};
//# sourceMappingURL=redis.config.js.map