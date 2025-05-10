"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmsConfig = void 0;
const getSmsConfig = (configService) => ({
    accessKeyId: configService.get('SMS_ACCESS_KEY_ID'),
    accessKeySecret: configService.get('SMS_ACCESS_KEY_SECRET'),
    signName: configService.get('SMS_SIGN_NAME'),
    templateCode: configService.get('SMS_TEMPLATE_CODE'),
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25',
});
exports.getSmsConfig = getSmsConfig;
//# sourceMappingURL=sms.config.js.map