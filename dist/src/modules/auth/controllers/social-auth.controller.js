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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const social_auth_service_1 = require("../services/social-auth.service");
const wechat_login_dto_1 = require("../dto/wechat-login.dto");
let SocialAuthController = class SocialAuthController {
    constructor(socialAuthService) {
        this.socialAuthService = socialAuthService;
    }
    async wechatLogin(dto) {
        return this.socialAuthService.handleWechatLogin(dto.code);
    }
};
exports.SocialAuthController = SocialAuthController;
__decorate([
    (0, common_1.Post)("wechat"),
    (0, swagger_1.ApiOperation)({ summary: "微信登录" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wechat_login_dto_1.WechatLoginDto]),
    __metadata("design:returntype", Promise)
], SocialAuthController.prototype, "wechatLogin", null);
exports.SocialAuthController = SocialAuthController = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth/social"),
    __metadata("design:paramtypes", [social_auth_service_1.SocialAuthService])
], SocialAuthController);
//# sourceMappingURL=social-auth.controller.js.map