import { Redis } from 'ioredis';
export declare class RedisService {
    private readonly redisClient;
    constructor(redisClient: Redis);
    setTempData(key: string, value: string, ttl: number): Promise<void>;
    getTempData(key: string): Promise<string | null>;
    deleteTempData(key: string): Promise<void>;
}
