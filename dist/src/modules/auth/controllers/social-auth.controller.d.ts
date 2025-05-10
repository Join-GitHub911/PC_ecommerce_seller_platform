import { SocialAuthService } from "../services/social-auth.service";
import { WechatLoginDto } from "../dto/wechat-login.dto";
export declare class SocialAuthController {
    private readonly socialAuthService;
    constructor(socialAuthService: SocialAuthService);
    wechatLogin(dto: WechatLoginDto): Promise<{
        accessToken: string;
        user: User;
    }>;
}
