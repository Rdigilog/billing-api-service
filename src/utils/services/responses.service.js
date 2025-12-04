"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponsesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let ResponsesService = class ResponsesService {
    responseCodes = {
        SUCCESS: 200,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
        INVALID_REQUEST: 400,
        FORBIDDEN: 403,
        TIMEOUT: 403,
        EXCEPTION: 500,
    };
    responseMessages = {
        SUCCESS: 'SUCCESSFUL',
        UNAUTHORIZED: 'UNAUTHORIZED',
        NOT_FOUND: 'Not Found',
        INVALID_REQUEST: 'INVALID REQUEST',
        FORBIDDEN: 'FORBIDDEN',
        TIMEOUT: 'GATEWAY TIMEOUT',
        EXCEPTION: 'INTERNAL SERVER ERROR',
    };
    success(message) {
        return {
            statusCode: this.responseCodes['SUCCESS'],
            message: this.responseMessages['SUCCESS'],
            data: this.cast(message),
        };
    }
    unauthorized(message) {
        return {
            statusCode: this.responseCodes['UNAUTHORIZED'],
            message: this.cast(message),
            data: null,
        };
    }
    badRequest(message) {
        return {
            statusCode: this.responseCodes['INVALID_REQUEST'],
            message: this.cast(message),
            data: null,
        };
    }
    notFound(message) {
        return {
            statusCode: this.responseCodes['INVALID_REQUEST'],
            message: this.cast(message),
            data: null,
        };
    }
    exception(message) {
        return {
            statusCode: this.responseCodes['EXCEPTION'],
            message: this.cast(message),
            data: null,
        };
    }
    cast(obj) {
        if (obj === null || obj === undefined) {
            return obj;
        }
        if (this.isDecimal(obj)) {
            console.log(obj);
            return obj.toString();
        }
        if (typeof obj === 'bigint') {
            return obj.toString();
        }
        if (obj instanceof Date) {
            return obj.toISOString();
        }
        if (Array.isArray(obj)) {
            return obj.map((value) => this.cast(value));
        }
        if (typeof obj === 'object') {
            const newObj = {};
            for (const key of Object.keys(obj)) {
                newObj[key] = this.cast(obj[key]);
            }
            return newObj;
        }
        return obj;
    }
    isDecimal(object) {
        return (typeof object === 'object' &&
            object !== null &&
            's' in object &&
            typeof object.s === 'number' &&
            'e' in object &&
            typeof object.e === 'number' &&
            'd' in object &&
            Array.isArray(object.d) &&
            object.d.every((digit) => typeof digit === 'number'));
    }
    pagination(page, size) {
        const limit = size ? +size : 10;
        const offset = page ? (page - 1) * limit : 0;
        return { limit, offset };
    }
    pagingData(data, page, limit) {
        const { totalItems, result } = data;
        const currentPage = page ? +page : 1;
        const totalPages = totalItems > limit ? Math.ceil(totalItems / limit) : 1;
        return { totalItems, result, totalPages, currentPage };
    }
    errorHandler(e) {
        const extractMessage = (msg) => {
            if (!msg)
                return 'An unexpected error occurred.';
            msg = msg
                .replace(/\s+/g, ' ')
                .replace(/Invalid\s+`prisma\.[\s\S]*?invocation:\s*/gi, '')
                .replace(/at\s+.+?PrismaClient\..+/, '')
                .trim();
            const patterns = [
                {
                    regex: /Unknown argument `([^`]+)`/i,
                    message: (m) => `Unknown field "${m[1]}" in your Prisma query.`,
                },
                {
                    regex: /Invalid value for argument `([^`]+)`.*?Expected ([\w]+)/i,
                    message: (m) => `Invalid value for field "${m[1]}". Expected ${m[2]}.`,
                },
                {
                    regex: /Invalid value for argument `([^`]+)`/i,
                    message: (m) => `Invalid value provided for field "${m[1]}".`,
                },
                {
                    regex: /Did you mean `([^`]+)`\?/i,
                    message: (m) => `Unknown field used. Did you mean "${m[1]}"?`,
                },
                {
                    regex: /Argument `([^`]+)` is missing/i,
                    message: (m) => `Missing required field "${m[1]}".`,
                },
                {
                    regex: /Argument `([^`]+)` must not be null/i,
                    message: (m) => `Field "${m[1]}" cannot be null.`,
                },
                {
                    regex: /Field `([^`]+)` is required/i,
                    message: (m) => `Field "${m[1]}" is required.`,
                },
                {
                    regex: /Record to (update|delete) not found/i,
                    message: () => `Record not found. Check if it exists before updating or deleting.`,
                },
                {
                    regex: /depends on one or more records that were required but not found/i,
                    message: () => `Operation failed because a related record was not found.`,
                },
                {
                    regex: /Unique constraint failed on the fields?: (.+?)(?=\s|$)/i,
                    message: (m) => `Duplicate value detected on field(s): ${m[1]}.`,
                },
                {
                    regex: /Foreign key constraint failed on the field: (.+?)(?=\s|$)/i,
                    message: (m) => `Foreign key constraint failed on field: ${m[1]}.`,
                },
            ];
            for (const { regex, message } of patterns) {
                const match = msg.match(regex);
                if (match)
                    return message(match);
            }
            const codeMatch = msg.match(/P\d{4}/);
            if (codeMatch)
                return `Database error (${codeMatch[0]}).`;
            const causeMatch = msg.match(/Error:\s*(.+)/i);
            if (causeMatch)
                return causeMatch[1].trim();
            return msg || 'Unknown database error.';
        };
        if (e instanceof client_1.Prisma.PrismaClientKnownRequestError ||
            e instanceof client_1.Prisma.PrismaClientUnknownRequestError ||
            e instanceof client_1.Prisma.PrismaClientRustPanicError ||
            e instanceof client_1.Prisma.PrismaClientInitializationError ||
            e instanceof client_1.Prisma.PrismaClientValidationError) {
            return { error: 2, body: extractMessage(e.message) };
        }
        if (e instanceof Error)
            return { error: 2, body: extractMessage(e.message) };
        return { error: 2, body: extractMessage(String(e)) };
    }
};
exports.ResponsesService = ResponsesService;
exports.ResponsesService = ResponsesService = __decorate([
    (0, common_1.Injectable)()
], ResponsesService);
//# sourceMappingURL=responses.service.js.map