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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const index_1 = require("@prisma/client/index");
const extension_read_replicas_1 = require("@prisma/extension-read-replicas");
const config_1 = require("@nestjs/config");
const config_keys_1 = require("./config.keys");
const child_process_1 = require("child_process");
const util_1 = require("util");
let PrismaService = PrismaService_1 = class PrismaService extends index_1.PrismaClient {
    configService;
    logger = new common_1.Logger(PrismaService_1.name);
    execAsync = (0, util_1.promisify)(child_process_1.exec);
    constructor(configService) {
        super({});
        this.configService = configService;
    }
    async onModuleInit() {
        await this.$connect();
        if (this.configService) {
            this.$extends((0, extension_read_replicas_1.readReplicas)({
                url: [this.configService.get(config_keys_1.CONFIG_KEYS.DATABASE_REPLICA_URL) || ''],
            }));
        }
        await this.runMigrations();
        this.logger.log('Prisma service initialized successfully');
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    async models() {
        return Object.keys(index_1.Prisma.ModelName);
    }
    async runMigrations() {
    }
    async healthCheck() {
        try {
            await this.$queryRaw `SELECT 1`;
            return {
                status: 'healthy',
                message: 'Database connection is healthy'
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                message: `Database health check failed: ${error.message}`,
                details: { error: error.message }
            };
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map