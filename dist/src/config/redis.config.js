"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisConfig = void 0;
const getRedisConfig = (configService) => ({
    config: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
        db: 0,
        keyPrefix: 'ecommerce:',
    },
});
exports.getRedisConfig = getRedisConfig;
//# sourceMappingURL=redis.config.js.map