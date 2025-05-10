"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("@/modules/user/services/user.service");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let SocialAuthService = class SocialAuthService {
    constructor(userService, jwtService, configService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.wechatAppId = this.configService.get("WECHAT_APP_ID");
        this.wechatAppSecret = this.configService.get("WECHAT_APP_SECRET");
    }
    async handleWechatLogin(code) {
        const { access_token, openid } = await this.getWechatAccessToken(code);
        const wechatUserInfo = await this.getWechatUserInfo(access_token, openid);
        let user = await this.userService.findByWechatOpenId(openid);
        if (!user) {
            user = await this.userService.createByWechat(openid, wechatUserInfo);
        }
        const accessToken = this.jwtService.sign({
            sub: user.id,
            username: user.username,
        });
        return { accessToken, user };
    }
    async getWechatAccessToken(code) {
        const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${this.wechatAppId}&secret=${this.wechatAppSecret}&code=${code}&grant_type=authorization_code`;
        try {
            const response = await axios_1.default.get(url);
            if (response.data.errcode) {
                throw new common_1.UnauthorizedException("微信登录失败: " + response.data.errmsg);
            }
            return {
                access_token: response.data.access_token,
                openid: response.data.openid,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException("微信登录失败");
        }
    }
    async getWechatUserInfo(accessToken, openid) {
        const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openid}`;
        try {
            const response = await axios_1.default.get(url);
            if (response.data.errcode) {
                throw new common_1.UnauthorizedException("获取微信用户信息失败");
            }
            return response.data;
        }
        catch (error) {
            throw new common_1.UnauthorizedException("获取微信用户信息失败");
        }
    }
};
exports.SocialAuthService = SocialAuthService;
exports.SocialAuthService = SocialAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object, jwt_1.JwtService,
        config_1.ConfigService])
], SocialAuthService);
//# sourceMappingURL=social-auth.service.js.map