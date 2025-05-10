import { SocialAuthService } from "./services/social-auth.service";
export declare class AuthController {
    private readonly socialAuthService;
    constructor(socialAuthService: SocialAuthService);
    wechatLogin(code: string): Promise<{
        accessToken: string;
        user: User;
    }>;
}
