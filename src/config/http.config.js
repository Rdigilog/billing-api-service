"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpModuleConfig = void 0;
const http_module_1 = require("@nestjs/axios/dist/http.module");
exports.HttpModuleConfig = http_module_1.HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
});
//# sourceMappingURL=http.config.js.map