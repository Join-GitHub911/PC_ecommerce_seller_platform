"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('config', () => ({
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: parseInt(process.env.REDIS_PORT, 10) || 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    ALIPAY_APP_ID: process.env.ALIPAY_APP_ID,
    ALIPAY_PRIVATE_KEY: process.env.ALIPAY_PRIVATE_KEY,
    ALIPAY_PUBLIC_KEY: process.env.ALIPAY_PUBLIC_KEY,
    ALIPAY_NOTIFY_URL: process.env.ALIPAY_NOTIFY_URL,
    SMS_ACCESS_KEY_ID: process.env.SMS_ACCESS_KEY_ID,
    SMS_ACCESS_KEY_SECRET: process.env.SMS_ACCESS_KEY_SECRET,
    SMS_SIGN_NAME: process.env.SMS_SIGN_NAME,
    SMS_TEMPLATE_CODE: process.env.SMS_TEMPLATE_CODE,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: parseInt(process.env.EMAIL_PORT, 10) || 587,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    UPLOAD_DIR: process.env.UPLOAD_DIR,
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760,
    ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES,
    THROTTLE_TTL: parseInt(process.env.THROTTLE_TTL, 10) || 60000,
    THROTTLE_LIMIT: parseInt(process.env.THROTTLE_LIMIT, 10) || 10,
}));
//# sourceMappingURL=configuration.js.map