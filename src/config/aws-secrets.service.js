"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AwsSecretsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsSecretsService = void 0;
const common_1 = require("@nestjs/common");
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
let AwsSecretsService = AwsSecretsService_1 = class AwsSecretsService {
    logger = new common_1.Logger(AwsSecretsService_1.name);
    secretsClient;
    cachedSecrets = null;
    cacheExpiry = 0;
    CACHE_DURATION = 5 * 60 * 1000;
    constructor() {
        this.secretsClient = new client_secrets_manager_1.SecretsManagerClient({
            region: process.env.AWS_REGION || 'eu-west-2',
        });
    }
    async getSecrets(secretId) {
        if (this.cachedSecrets && Date.now() < this.cacheExpiry) {
            this.logger.debug('Returning cached secrets');
            return this.cachedSecrets;
        }
        try {
            this.logger.log(`Fetching secrets from AWS Secrets Manager: ${secretId}`);
            const command = new client_secrets_manager_1.GetSecretValueCommand({
                SecretId: secretId,
            });
            const response = await this.secretsClient.send(command);
            if (!response.SecretString) {
                throw new Error('No secret string found in AWS Secrets Manager response');
            }
            const secrets = JSON.parse(response.SecretString);
            this.cachedSecrets = secrets;
            this.cacheExpiry = Date.now() + this.CACHE_DURATION;
            this.logger.log('Successfully fetched and cached secrets from AWS Secrets Manager');
            return secrets;
        }
        catch (error) {
            this.logger.error('Failed to fetch secrets from AWS Secrets Manager:', error);
            throw new Error(`Failed to fetch secrets: ${error.message}`);
        }
    }
    clearCache() {
        this.cachedSecrets = null;
        this.cacheExpiry = 0;
        this.logger.debug('Secrets cache cleared');
    }
};
exports.AwsSecretsService = AwsSecretsService;
exports.AwsSecretsService = AwsSecretsService = AwsSecretsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AwsSecretsService);
//# sourceMappingURL=aws-secrets.service.js.map