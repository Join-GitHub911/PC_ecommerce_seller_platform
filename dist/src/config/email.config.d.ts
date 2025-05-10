import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './env.config';
export declare const getEmailConfig: (configService: ConfigService<EnvConfig>) => {
    host: any;
    port: any;
    secure: boolean;
    auth: {
        user: any;
        pass: any;
    };
    from: any;
};
