"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailConfig = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const config_1 = require("@nestjs/config");
const config_keys_1 = require("./config.keys");
exports.MailConfig = mailer_1.MailerModule.forRootAsync({
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: (configService) => ({
        transport: {
            host: configService.get(config_keys_1.CONFIG_KEYS.MAIL_HOST),
            port: configService.get(config_keys_1.CONFIG_KEYS.MAIL_PORT),
            secure: true,
            auth: {
                user: configService.get(config_keys_1.CONFIG_KEYS.MAIL_USER),
                pass: configService.get(config_keys_1.CONFIG_KEYS.MAIL_PASS),
            },
        },
        defaults: {
            from: '"DigiLog" <inof@digiLog.com>',
        },
        template: {
            dir: process.cwd() + '/mails/',
            adapter: new handlebars_adapter_1.HandlebarsAdapter(),
            options: {
                strict: true,
            },
        },
    }),
});
//# sourceMappingURL=mail.config.js.map