import { RedisModuleOptions } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './env.config';
export declare const getRedisConfig: (configService: ConfigService<EnvConfig>) => RedisModuleOptions;
