"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailConfig = void 0;
const getEmailConfig = (configService) => ({
    host: configService.get('EMAIL_HOST'),
    port: configService.get('EMAIL_PORT'),
    secure: false,
    auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
    },
    from: configService.get('EMAIL_FROM'),
});
exports.getEmailConfig = getEmailConfig;
//# sourceMappingURL=email.config.js.map