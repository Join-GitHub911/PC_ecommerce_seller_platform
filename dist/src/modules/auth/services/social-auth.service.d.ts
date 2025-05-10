import { JwtService } from "@nestjs/jwt";
import { UserService } from "@/modules/user/services/user.service";
import { ConfigService } from "@nestjs/config";
import { User } from "@/entities/User";
export declare class SocialAuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly configService;
    private readonly wechatAppId;
    private readonly wechatAppSecret;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService);
    handleWechatLogin(code: string): Promise<{
        accessToken: string;
        user: User;
    }>;
    private getWechatAccessToken;
    private getWechatUserInfo;
}
