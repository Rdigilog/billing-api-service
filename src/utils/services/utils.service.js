"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsService = void 0;
const common_1 = require("@nestjs/common");
const bcryptjs_1 = require("bcryptjs");
const uniqid_1 = require("uniqid");
let UtilsService = class UtilsService {
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
    nextBilling() {
        const currentDate = new Date();
        const nextBilling = new Date(currentDate);
        nextBilling.setDate(currentDate.getDate() + 30);
        return nextBilling;
    }
    exclude(data, keys) {
        return Object.fromEntries(Object.entries(data).filter(([key]) => !keys.includes(key)));
    }
    async hashPassword(plain, p0) {
        try {
            const salt = await (0, bcryptjs_1.genSalt)(p0);
            const hashedPassword = await (0, bcryptjs_1.hash)(plain, salt);
            return hashedPassword;
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }
    async comparePassword(plain, hash) {
        try {
            return await (0, bcryptjs_1.compare)(plain, hash);
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
    validateContact(identifier) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?\d{7,15}$/;
        if (emailRegex.test(identifier)) {
            return 'email';
        }
        else if (phoneRegex.test(identifier)) {
            return 'phone';
        }
        else {
            return null;
        }
    }
    formatPhoneNumber(phoneNumber) {
        if (phoneNumber.startsWith('0')) {
            return '234' + phoneNumber.slice(1);
        }
        return phoneNumber;
    }
    lisaUnique() {
        try {
            return (0, uniqid_1.process)('RD').toUpperCase();
        }
        catch (e) {
            return null;
        }
    }
};
exports.UtilsService = UtilsService;
exports.UtilsService = UtilsService = __decorate([
    (0, common_1.Injectable)()
], UtilsService);
//# sourceMappingURL=utils.service.js.map