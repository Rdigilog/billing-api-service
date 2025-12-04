"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
const Joi = __importStar(require("joi"));
exports.validationSchema = Joi.object({
    PORT: Joi.number().default(3001),
    NODE_ENV: Joi.string().valid('local', 'development', 'production').default('development'),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRATION_TIME: Joi.string().default('1h'),
    DATABASE_URL: Joi.string().required(),
    DATABASE_URL_REPLICA: Joi.string().required(),
    AUTO_MIGRATE: Joi.string().default('false'),
    REDIS_URL: Joi.string().required(),
    MAIL_HOST: Joi.string().required(),
    MAIL_PORT: Joi.number().default(465),
    MAIL_USER: Joi.string().required(),
    MAIL_PASS: Joi.string().required(),
    FILE_UPLOAD_PROVIDER: Joi.string().required(),
    AWS_REGION: Joi.string().when('NODE_ENV', {
        is: 'local',
        then: Joi.string().optional(),
        otherwise: Joi.string().default('eu-west-2')
    }),
    AWS_SECRET_ID: Joi.string().when('NODE_ENV', {
        is: 'local',
        then: Joi.string().optional(),
        otherwise: Joi.string().default('dev-secret-manager-01')
    }),
});
//# sourceMappingURL=validation.schema.js.map