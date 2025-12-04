export interface AwsSecrets {
    REDIS_URL: string;
    DATABASE_URL: string;
    NODE_ENV: string;
    JWT_SECRET: string;
    JWT_EXPIRATION_TIME: string;
    DATABASE_URL_REPLICA: string;
    AUTO_MIGRATE: string;
    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_USER: string;
    MAIL_PASS: string;
    FILE_UPLOAD_PROVIDER: string;
}
export declare class AwsSecretsService {
    private readonly logger;
    private secretsClient;
    private cachedSecrets;
    private cacheExpiry;
    private readonly CACHE_DURATION;
    constructor();
    getSecrets(secretId: string): Promise<AwsSecrets>;
    clearCache(): void;
}
