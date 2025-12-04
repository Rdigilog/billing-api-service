"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisProvider = void 0;
const redis_1 = require("redis");
const config_1 = require("@nestjs/config");
const config_keys_1 = require("./config.keys");
exports.RedisProvider = {
    provide: 'REDIS_CONNECTION',
    useFactory: async (configService) => {
        const client = (0, redis_1.createClient)({
            url: configService.get(config_keys_1.CONFIG_KEYS.REDIS_URL),
        });
        await client.connect();
        return client;
    },
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=redis.provider.js.map