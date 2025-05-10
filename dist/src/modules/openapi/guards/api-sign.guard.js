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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiSignGuard = void 0;
const common_1 = require("@nestjs/common");
const api_client_service_1 = require("../services/api-client.service");
let ApiSignGuard = class ApiSignGuard {
    constructor(apiClientService) {
        this.apiClientService = apiClientService;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const appKey = req.headers["x-app-key"];
        const appSecret = req.headers["x-app-secret"];
        if (!appKey || !appSecret)
            throw new common_1.UnauthorizedException("缺少API凭证");
        const client = await this.apiClientService.validate(appKey, appSecret);
        if (!client)
            throw new common_1.UnauthorizedException("API凭证无效");
        req.apiClient = client;
        return true;
    }
};
exports.ApiSignGuard = ApiSignGuard;
exports.ApiSignGuard = ApiSignGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [api_client_service_1.ApiClientService])
], ApiSignGuard);
//# sourceMappingURL=api-sign.guard.js.map