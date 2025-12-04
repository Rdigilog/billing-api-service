"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bullboardConfig = void 0;
const express_1 = require("@bull-board/express");
const nestjs_1 = require("@bull-board/nestjs");
exports.bullboardConfig = nestjs_1.BullBoardModule.forRoot({
    route: '/queues',
    adapter: express_1.ExpressAdapter,
});
//# sourceMappingURL=bull-board.config.js.map