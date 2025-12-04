"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const utils_service_1 = require("./services/utils.service");
const otp_service_1 = require("./services/otp.service");
const redis_service_1 = require("./services/redis.service");
const general_service_1 = require("./services/general.service");
const responses_service_1 = require("./services/responses.service");
const ioredis_1 = __importDefault(require("ioredis"));
const file_upload_service_1 = require("./services/file-upload.service");
const factory_provider_1 = require("./services/factory.provider");
let UtilsModule = class UtilsModule {
};
exports.UtilsModule = UtilsModule;
exports.UtilsModule = UtilsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            utils_service_1.UtilsService,
            otp_service_1.OtpService,
            redis_service_1.RedisService,
            general_service_1.GeneralService,
            responses_service_1.ResponsesService,
            file_upload_service_1.FileUploadService,
            {
                provide: 'FileUploadProvider',
                useFactory: (configService) => {
                    return (0, factory_provider_1.fileUploadProviderFactory)(configService.get('FILE_UPLOAD_PROVIDER') || 'cloudinary', configService);
                },
                inject: [config_1.ConfigService],
            },
            {
                provide: 'REDIS_CLIENT',
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    return new ioredis_1.default(configService.get('REDIS_URL') || '');
                },
            },
        ],
        exports: [
            utils_service_1.UtilsService,
            otp_service_1.OtpService,
            redis_service_1.RedisService,
            general_service_1.GeneralService,
            responses_service_1.ResponsesService,
            file_upload_service_1.FileUploadService,
            'REDIS_CLIENT',
        ],
    })
], UtilsModule);
//# sourceMappingURL=utils.module.js.map