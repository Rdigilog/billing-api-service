"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralService = void 0;
const common_1 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
let GeneralService = class GeneralService {
    getDateRange(rangeType) {
        const now = new Date();
        let currentStartDate;
        let currentEndDate;
        let previousStartDate;
        let previousEndDate;
        switch (rangeType) {
            case 'day':
                currentStartDate = (0, date_fns_1.startOfDay)(now);
                currentEndDate = (0, date_fns_1.endOfDay)(now);
                previousStartDate = (0, date_fns_1.startOfDay)((0, date_fns_1.subDays)(now, 1));
                previousEndDate = (0, date_fns_1.endOfDay)((0, date_fns_1.subDays)(now, 1));
                break;
            case 'week':
                currentStartDate = (0, date_fns_1.startOfWeek)(now, { weekStartsOn: 1 });
                currentEndDate = (0, date_fns_1.endOfWeek)(now, { weekStartsOn: 1 });
                previousStartDate = (0, date_fns_1.startOfWeek)((0, date_fns_1.subWeeks)(now, 1), { weekStartsOn: 1 });
                previousEndDate = (0, date_fns_1.endOfWeek)((0, date_fns_1.subWeeks)(now, 1), { weekStartsOn: 1 });
                break;
            case 'month':
                currentStartDate = (0, date_fns_1.startOfMonth)(now);
                currentEndDate = (0, date_fns_1.endOfMonth)(now);
                previousStartDate = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 1));
                previousEndDate = (0, date_fns_1.endOfMonth)((0, date_fns_1.subMonths)(now, 1));
                break;
            case 'year':
                currentStartDate = (0, date_fns_1.startOfYear)(now);
                currentEndDate = (0, date_fns_1.endOfYear)(now);
                previousStartDate = (0, date_fns_1.startOfYear)((0, date_fns_1.subYears)(now, 1));
                previousEndDate = (0, date_fns_1.endOfYear)((0, date_fns_1.subYears)(now, 1));
                break;
            default:
                throw new Error(`Invalid range type: ${rangeType}`);
        }
        return {
            currentEndDate,
            currentStartDate,
            previousEndDate,
            previousStartDate,
        };
    }
};
exports.GeneralService = GeneralService;
exports.GeneralService = GeneralService = __decorate([
    (0, common_1.Injectable)()
], GeneralService);
//# sourceMappingURL=general.service.js.map