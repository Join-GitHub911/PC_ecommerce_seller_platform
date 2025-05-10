import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './env.config';
export declare const getSmsConfig: (configService: ConfigService<EnvConfig>) => {
    accessKeyId: any;
    accessKeySecret: any;
    signName: any;
    templateCode: any;
    endpoint: string;
    apiVersion: string;
};
