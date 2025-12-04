"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtConfig = void 0;
const config_1 = require("@nestjs/config");
const jwt_module_1 = require("@nestjs/jwt/dist/jwt.module");
exports.JwtConfig = jwt_module_1.JwtModule.registerAsync({
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: (config) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
    }),
});
//# sourceMappingURL=jwt.config.js.map